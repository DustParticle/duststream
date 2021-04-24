using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbProcedureExecutionDataService : ICdbProcedureExecutionDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private static readonly string ProcedureExecutionTableSuffix = "ProcedureExecutions";

        public CdbProcedureExecutionDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;
        }

        public Task<IEnumerable<ProcedureExecution>> GetAllByRNPAsync(string projectName, string revisionNumber, string procedureName)
        {
            CosmosDbHelper cosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, projectName + ProcedureExecutionTableSuffix);
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{revisionNumber}' AND c.ProcedureShortName = '{procedureName}'";
            return cosmosDbContainer.QueryItemsAsync<ProcedureExecution>(queryString);
        }

        public Task InsertOrReplaceAsync(string projectName, ProcedureExecution procedureExecution)
        {
            CosmosDbHelper cosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, projectName + ProcedureExecutionTableSuffix);
            return cosmosDbContainer.InsertOrReplaceAsync(procedureExecution.RevisionNumber, procedureExecution.JobId, procedureExecution);
        }
    }
}
