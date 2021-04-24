using DustStream.Extensions;
using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using DustStream.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DustStream.Controllers
{
    public class ReleaseStatusRequest
    {
        public string DataLink { get; set; }
    }

    [Route("api/[controller]")]
    public class ReleasesController : Controller
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly AzureAdOptions AzureAdConfig;
        private readonly ICdbReleaseDataService ReleaseDataService;
        private readonly ICdbRevisionDataService RevisionDataService;
        private readonly ICdbProjectDataService ProjectDataService;
        private readonly IAzureDevOpsService AzureDevOpsService;
        private readonly IHubContext<Hubs.BroadcastStatusHub> BroadcastStatusHubContext;

        public ReleasesController(IOptions<CosmosDbOptions> CosmosDbConfig, IOptions<AzureAdOptions> AzureAdConfig,
            ICdbReleaseDataService releaseDataService, ICdbRevisionDataService revisionDataService, ICdbProjectDataService projectDataService,
            IAzureDevOpsService azureDevOpsService, IHubContext<Hubs.BroadcastStatusHub> broadcastStatusHubContext)
        {
            this.CosmosDbConfig = CosmosDbConfig.Value;
            this.AzureAdConfig = AzureAdConfig.Value;
            this.ReleaseDataService = releaseDataService;
            this.RevisionDataService = revisionDataService;
            this.ProjectDataService = projectDataService;
            this.AzureDevOpsService = azureDevOpsService;
            this.BroadcastStatusHubContext = broadcastStatusHubContext;
        }

        [Authorize]
        [HttpGet("projects/{projectName}")]
        public async Task<IEnumerable<Release>> GetReleases([FromRoute] string projectName)
        {
            return await ReleaseDataService.GetAllByProjectAsync(projectName);
        }

        [Authorize]
        [HttpGet("projects/{projectName}/revisions/{revisionNumber}")]
        public async Task<Release> GetRelease([FromRoute] string projectName, [FromRoute] string revisionNumber)
        {
            return await ReleaseDataService.GetAsync(projectName, revisionNumber);
        }

        private async Task<string> ExchangeToAzureDevOpsToken(string aadAccessToken)
        {
            // Exchange aadToken to Azure DevOps's access token
            string resourceId = "499b84ac-1321-427f-aa17-267ca6975798";         // Azure DevOps resource Id
            string username = User.FindFirst(ClaimTypes.Upn)?.Value;
            string userAccessToken = aadAccessToken;
            UserAssertion userAssertion = new UserAssertion(userAccessToken, "urn:ietf:params:oauth:grant-type:jwt-bearer", username);
            ClientCredential clientCred = new ClientCredential(AzureAdConfig.ClientId, AzureAdConfig.ClientSecret);
            string authority = $"{AzureAdConfig.Instance}{AzureAdConfig.TenantId}";
            AuthenticationContext authContext = new AuthenticationContext(authority);
            var result = await authContext.AcquireTokenAsync(resourceId, clientCred, userAssertion);
            return result.AccessToken;
        }

        [Authorize]
        [HttpPost("projects/{projectName}/revisions/{revisionNumber}/createRelease")]
        public async Task<IActionResult> CreateRelease([FromRoute] string revisionNumber, [FromRoute] string projectName, [FromBody] QueueReleaseRequest request)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
            if (null == project)
            {
                return new NotFoundObjectResult("Project not found");
            }

            Revision revision = await RevisionDataService.GetAsync(projectName, revisionNumber);
            if (revision == null)
            {
                return new NotFoundObjectResult("Revision not found");
            } else
            {
                if (project.AzureDevOps != null)
                {
                    dynamic desObject = JsonConvert.DeserializeObject<dynamic>(revision.CommitPayload);
                    string commitNumber = Convert.ToString(desObject.commit);

                    string aadAccessToken = this.HttpContext.Request?.Headers["Authorization"].ToString().Replace("Bearer ", "");
                    string accessToken = await ExchangeToAzureDevOpsToken(aadAccessToken); Release returnRelease = await AzureDevOpsService.QueueRelease(project.AzureDevOps, request, accessToken, projectName, revisionNumber, commitNumber);
                    if (returnRelease != null)
                    {
                        returnRelease.Status = "InProgress";
                        await ReleaseDataService.InsertOrReplaceAsync(returnRelease).ContinueWith(async (antecedent) =>
                        {
                            await BroadcastStatusHubContext.Clients.All.SendAsync(EventTable.GetEventMessage(EventTable.EventID.EventReleaseStatusChanged), returnRelease);
                        }, TaskContinuationOptions.OnlyOnRanToCompletion);
                        return Ok(returnRelease);
                    }
                }
                return StatusCode(500);
            }
        }

        [ApiKeyAuthorize("projectName")]
        [HttpPost("{revisionNumber}/executions/projects/{projectName}/status/{status}")]
        public async Task<IActionResult> UpdateReleaseStatus([FromRoute] string revisionNumber, [FromRoute] string projectName,
            [FromRoute] string status, [FromBody] ReleaseStatusRequest releaseStatus)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
            if (project == null)
            {
                return new NotFoundObjectResult("Project not found");
            }

            Release release = await ReleaseDataService.GetAsync(projectName, revisionNumber);
            if (release == null)
            {
                return new NotFoundObjectResult("Revision not found");
            } else
            {
                release.Status = status;
                release.ReleaseDataLink = releaseStatus.DataLink;
                await ReleaseDataService.InsertOrReplaceAsync(release).ContinueWith(async (antecedent) =>
                {
                    await BroadcastStatusHubContext.Clients.All.SendAsync(EventTable.GetEventMessage(EventTable.EventID.EventReleaseStatusChanged), release);
                }, TaskContinuationOptions.OnlyOnRanToCompletion);
                
            }

            return Ok(release);
        }
    }
}