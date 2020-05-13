using DustStream.Extensions;
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
    public class ProjectsController : Controller
    {
        private readonly TableStorageOptions TableStorageConfig;
        private IProjectDataService ProjectDataService;

        public ProjectsController(IOptions<TableStorageOptions> TableStorageConfig, IProjectDataService projectDataService)
        {
            this.TableStorageConfig = TableStorageConfig.Value;
            this.ProjectDataService = projectDataService;
        }

        [ApiKeyAuthorize()]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]string[] projectNames)
        {
            Project[] projects = new Project[projectNames.Length];
            for (int i = 0; i < projects.Length; ++i)
            {
                projects[i] = new Project(TableStorageConfig.DomainString, projectNames[i], projectNames[i]);
            }
            await ProjectDataService.InsertAsync(projects);

            return Ok();
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
    }
}