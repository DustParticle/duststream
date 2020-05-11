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
        private IRevisionDataService RevisionDataService;

        public RevisionsController(IOptions<TableStorageOptions> TableStorageConfig, IRevisionDataService revisionDataService)
        {
            this.TableStorageConfig = TableStorageConfig.Value;
            this.RevisionDataService = revisionDataService;
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
    }
}