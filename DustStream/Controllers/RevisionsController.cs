using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Controllers
{
    [Route("api/[controller]")]
    public class RevisionsController : Controller
    {
        private readonly TableStorageOptions TableStorageConfig;
        private readonly IRevisionDataService RevisionDataService;
        private readonly IProjectDataService ProjectDataService;
        private readonly IAzureDevOpsService AzureDevOpsService;

        public RevisionsController(IOptions<TableStorageOptions> TableStorageConfig, IRevisionDataService revisionDataService,
            IProjectDataService projectDataService, IAzureDevOpsService azureDevOpsService)
        {
            this.TableStorageConfig = TableStorageConfig.Value;
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
        [HttpPost("projects/{projectName}/trigger")]
        public async Task<IActionResult> Trigger([FromRoute] string projectName, [FromBody] QueueAzureBuildRequest request)
        {
            Project project = await ProjectDataService.GetAsync(TableStorageConfig.DomainString, projectName);
            if (null == project)
            {
                return new NotFoundObjectResult("Project not found");
            }

            if (project.AzureDevOps != null)
            {
                // Trigger Azure DevOps build
                Revision revision = await AzureDevOpsService.QueueBuild(project.AzureDevOps, request);
                if (revision != null)
                    return Ok(revision);
                return StatusCode(500);
            }

            return new NotFoundObjectResult("CI/CD service not found");
        }
    }
}