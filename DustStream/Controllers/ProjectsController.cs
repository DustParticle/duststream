using DustStream.Extensions;
using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DustStream.Controllers
{
    [Route("api/[controller]")]
    public class ProjectsController : Controller
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly IProjectDataService ProjectDataService;

        public ProjectsController(IOptions<CosmosDbOptions> CosmosDbConfig, IProjectDataService projectDataService)
        {
            this.CosmosDbConfig = CosmosDbConfig.Value;
            this.ProjectDataService = projectDataService;
        }

        [Authorize()]
        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            return await ProjectDataService.GetAllByDomainAsync(CosmosDbConfig.DomainString);
        }

        [Authorize]
        [HttpGet("{projectName}")]
        public async Task<Project> GetProject([FromRoute] string projectName)
        {
            return await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
        }

        // TODO: support admin privilege
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project request)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, request.Name);
            if (null != project)
            {
                return Conflict(new { message = $"The project '{request.Name}' is already existed." });
            }

            request.DomainString = CosmosDbConfig.DomainString;
            request.Timestamp = DateTime.Now;
            UpdateApiKey(in request);
            await ProjectDataService.InsertAsync(request);

            return Ok(request);
        }

        // TODO: support admin privilege
        [Authorize]
        [HttpPut("{projectName}/generateApiKey")]
        public async Task<IActionResult> GenerateApiKey([FromRoute] string projectName)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
            if (null == project)
            {
                return NotFound();
            }

            UpdateApiKey(in project);
            await ProjectDataService.UpdateAsync(project);

            return Ok(project);
        }

        [Authorize]
        [HttpPut("{projectName}/updateCiService")]
        public async Task<IActionResult> UpdateCiService([FromRoute] string projectName, [FromBody] Project request)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
            if (null == project)
            {
                return NotFound();
            }

            project.AzureDevOps = request.AzureDevOps;
            project.VariablesDef = request.VariablesDef;
            await ProjectDataService.ReplaceAsync(project);

            return Ok(project);
        }

        private void UpdateApiKey(in Project project)
        {
            var key = new byte[32];
            var generator = RandomNumberGenerator.Create();
            generator.GetBytes(key);
            project.ApiKey = Convert.ToBase64String(key);

            MD5 md5 = MD5.Create();
            project.HashedApiKey = Encoding.UTF8.GetString(md5.ComputeHash(Encoding.UTF8.GetBytes(project.ApiKey)));
        }
    }
}