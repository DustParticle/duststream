using DustStream.Extensions;
using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using DustStream.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace DustStream.Controllers
{
    public class JobStatusRequest
    {
        public string JobId { get; set; }
        public string JobName { get; set; }
        public string ProjectName { get; set; }
        public string CommitSet { get; set; }
        public object Commit { get; set; }
        public object CiConfiguration { get; set; }
        public string ConfigName { get; set; }
        public string AdditionalConfiguration { get; set; }
        public string RevisionNumber { get; set; }
        public string ConsoleLog { get; set; }
        public string Machine { get; set; }
        public string DownloadLink { get; set; }
    }

    [Route("api/[controller]")]
    public class ProceduresController : Controller
    {
        private enum ProcedureStatus
        {
            NoStatus = 0,
            Success,
            InQueue,
            InProgress,
            Failed,
            Canceled
        }

        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly ICdbProjectDataService ProjectDataService;
        private readonly ICdbRevisionDataService RevisionDataService;
        private readonly ICdbProcedureDataService ProcedureDataService;
        private readonly ICdbProcedureExecutionDataService ProcedureExecutionDataService;
        private readonly IHubContext<Hubs.BroadcastStatusHub> BroadcastStatusHubContext;

        public ProceduresController(IOptions<CosmosDbOptions> CosmosDbConfig,
            ICdbProjectDataService projectDataService,
            ICdbRevisionDataService revisionDataService,
            ICdbProcedureDataService procedureDataService,
            ICdbProcedureExecutionDataService procedureExecutionDataService,
            IHubContext<Hubs.BroadcastStatusHub> broadcastStatusHubContext)
        {
            this.CosmosDbConfig = CosmosDbConfig.Value;
            ProjectDataService = projectDataService;
            RevisionDataService = revisionDataService;
            ProcedureDataService = procedureDataService;
            ProcedureExecutionDataService = procedureExecutionDataService;
            BroadcastStatusHubContext = broadcastStatusHubContext;
        }

        [Authorize]
        [HttpGet("projects/{projectName}")]
        public async Task<IEnumerable<Procedure>> GetProcedures([FromRoute] string projectName)
        {
            return await ProcedureDataService.GetAllByProjectAsync(projectName);
        }

        [Authorize]
        [HttpGet("{procedure}/executions/projects/{projectName}/revisions/{revision}")]
        public async Task<IEnumerable<ProcedureExecution>> GetProcedureExecutions([FromRoute] string procedure, [FromRoute] string projectName, [FromRoute] string revision)
        {
            return await ProcedureExecutionDataService.GetAllByRNPAsync(projectName, revision, procedure);
        }

        [Authorize]
        [HttpGet("{procedure}/executions/projects/{projectName}/revisions/{revision}/status")]
        public async Task<JsonResult> GetProcedureExecutionOverallStatus([FromRoute] string procedure, [FromRoute] string projectName, [FromRoute] string revision)
        {
            IEnumerable<ProcedureExecution> procedureExecutions = await ProcedureExecutionDataService.GetAllByRNPAsync(projectName, revision, procedure);

            uint currentPriorityNumber = 0;
            foreach (ProcedureExecution procedureExecution in procedureExecutions)
            {
                if (Enum.TryParse<ProcedureStatus>(procedureExecution.Status, out ProcedureStatus newPriorityNumber))
                {
                    if ((uint)newPriorityNumber > currentPriorityNumber)
                    {
                        currentPriorityNumber = (uint)newPriorityNumber;
                    }
                }
            }

            return Json(Enum.GetName(typeof(ProcedureStatus), currentPriorityNumber));
        }

        [ApiKeyAuthorize("projectName")]
        [HttpPost("{procedureName}/executions/projects/{projectName}/revisions/{revisionNumber}/status/{status}")]
        public async Task<IActionResult> UpdateProcedureExecutionStatus([FromRoute] string procedureName, [FromRoute] string projectName,
            [FromRoute] string revisionNumber, [FromRoute] string status, [FromBody] JobStatusRequest jobStatus)
        {
            Project project = await ProjectDataService.GetAsync(CosmosDbConfig.DomainString, projectName);
            if (project == null)
            {
                return Unauthorized();
            }

            var tasks = new List<Task>();

            Revision revision = await RevisionDataService.GetAsync(projectName, revisionNumber);
            if (revision == null)
            {
                revision = new Revision()
                {
                    ProjectName = projectName,
                    RevisionNumber = revisionNumber,
                    Requestor = "",
                    CommitSet = jobStatus.CommitSet,
                    CommitPayload = JsonSerializer.Serialize(jobStatus.Commit),
                    CreatedTime = DateTimeOffset.Now
                };
                tasks.Add(RevisionDataService.InsertAsync(revision));
            }
            else
            {
                revision.CommitPayload = JsonSerializer.Serialize(jobStatus.Commit);
                tasks.Add(RevisionDataService.UpdateAsync(revision));
            }

            Procedure procedure = await ProcedureDataService.GetAsync(projectName, procedureName);
            if (procedure == null)
            {
                procedure = new Procedure(projectName, procedureName)
                {
                    CreatedTime = DateTimeOffset.Now,
                    LongName = procedureName
                };
                tasks.Add(ProcedureDataService.InsertAsync(procedure));
            }

            // Update status
            ProcedureExecution procedureExecution = new ProcedureExecution(revisionNumber, jobStatus.JobId, procedureName,
                JsonSerializer.Serialize(jobStatus.CiConfiguration), status)
            {
                DownloadLink = jobStatus.DownloadLink,
                ConsoleLog = jobStatus.ConsoleLog,
                Machine = jobStatus.Machine
            };
            tasks.Add(ProcedureExecutionDataService.InsertOrReplaceAsync(projectName, procedureExecution));

            // Make sure all changes from database are done before trigger event to clients
            await Task.WhenAll(tasks).ContinueWith(async (antecedent) =>
            {
                await BroadcastStatusHubContext.Clients.All.SendAsync(EventTable.GetEventMessage(EventTable.EventID.EventProcedureExecutionStatusChanged), projectName, revision, procedureExecution);
            }, TaskContinuationOptions.OnlyOnRanToCompletion);

            return Ok();
        }
    }
}