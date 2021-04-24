using DustStream.Extensions;
using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DustStream.Controllers
{
    [Route("api/[controller]")]
    public class RevisionsController : Controller
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly AzureAdOptions AzureAdConfig;
        private readonly ICdbRevisionDataService RevisionDataService;
        private readonly ICdbProjectDataService ProjectDataService;
        private readonly IAzureDevOpsService AzureDevOpsService;

        public RevisionsController(IOptions<CosmosDbOptions> CosmosDbConfig, IOptions<AzureAdOptions> AzureAdConfig,
            ICdbRevisionDataService revisionDataService, ICdbProjectDataService projectDataService, IAzureDevOpsService azureDevOpsService)
        {
            this.CosmosDbConfig = CosmosDbConfig.Value;
            this.AzureAdConfig = AzureAdConfig.Value;
            this.RevisionDataService = revisionDataService;
            this.ProjectDataService = projectDataService;
            this.AzureDevOpsService = azureDevOpsService;
        }

        [Authorize]
        [HttpGet("projects/{projectName}")]
        public async Task<IEnumerable<Revision>> GetRevisions([FromRoute] string projectName)
        {
            return await RevisionDataService.GetAllByProjectAsync(projectName);
        }

        [Authorize]
        [HttpGet("projects/{projectName}/{revisionNumber}")]
        public async Task<Revision> GetRevision([FromRoute] string projectName, [FromRoute] string revisionNumber)
        {
            return await RevisionDataService.GetAsync(projectName, revisionNumber);
        }

        [Authorize]
        [HttpPost("projects/{projectName}/trigger/azure")]
        public async Task<IActionResult> TriggerAzure([FromRoute] string projectName, [FromBody] QueueBuildRequest request)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
            if (null == project)
            {
                return new NotFoundObjectResult("Project not found");
            }

            if (project.AzureDevOps != null)
            {
                string aadAccessToken = this.HttpContext.Request?.Headers["Authorization"].ToString().Replace("Bearer ", "");
                string accessToken = await ExchangeToAzureDevOpsToken(aadAccessToken);
                Revision revision = await AzureDevOpsService.QueueBuild(project.AzureDevOps, request, accessToken);
                if (revision == null)
                {
                    return StatusCode(500);
                }

                revision.ProjectName = projectName;
                await RevisionDataService.InsertAsync(revision);
                return Ok(revision);
            }

            return new NotFoundObjectResult("CI/CD service not found");
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
    }
}