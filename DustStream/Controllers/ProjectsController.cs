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
using System.Threading.Tasks;

namespace DustStream.Controllers
{
    [Route("api/[controller]")]
    public class ProjectsController : Controller
    {
        private readonly TableStorageOptions TableStorageConfig;
        private IProjectDataService ProjectDataService;

        public ProjectsController(IOptions<TableStorageOptions> TableStorageConfig, IProjectDataService projectDataService)
        {
            this.TableStorageConfig = TableStorageConfig.Value;
            this.ProjectDataService = projectDataService;
        }

        [Authorize()]
        [HttpGet]
        public async Task<IEnumerable<Project>> Get()
        {
            return await ProjectDataService.GetAllByDomainAsync(TableStorageConfig.DomainString);
        }

        [Authorize]
        [HttpGet("{projectName}")]
        public async Task<Project> GetProject([FromRoute] string projectName)
        {
            return await ProjectDataService.GetAsync(TableStorageConfig.DomainString, projectName);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project request)
        {
            Project project = await ProjectDataService.GetAsync(TableStorageConfig.DomainString, request.Name);
            if (null != project)
            {
                return Conflict(new { message = $"The project '{request.Name}' is already existed." }); ;
            }
            
            project = new Project()
            {
                DomainString = TableStorageConfig.DomainString,
                Name = request.Name,
                Description = request.Description,
                ApiKey = GenerateApiKey()
            };
            await ProjectDataService.InsertAsync(project);

            return Ok(project);
        }

        private string GenerateApiKey()
        {
            var key = new byte[32];
            var generator = RandomNumberGenerator.Create();
            generator.GetBytes(key);
            return Convert.ToBase64String(key);
        }
    }
}