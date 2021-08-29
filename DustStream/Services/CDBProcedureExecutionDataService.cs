using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbProcedureExecutionDataService : IProcedureExecutionDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string PrefixPartitionKey = "ProcedureExecutionsPrefix-";

        public CdbProcedureExecutionDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;

            // Beware: This source code is duplicated since we are use DomainString for single container to save cost
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, this.CosmosDbConfig.DomainString, this.CosmosDbConfig.DomainString);
        }

        public Task<IEnumerable<ProcedureExecution>> GetAllByRNPAsync(string projectName, string revisionNumber, string procedureName)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{StandadizePartitionKey(projectName, revisionNumber)}' AND c.ProcedureShortName = '{procedureName}'";
            return CosmosDbContainer.QueryItemsAsync<ProcedureExecution>(queryString);
        }

        public Task InsertOrReplaceAsync(string projectName, ProcedureExecution procedureExecution)
        {
            procedureExecution.RevisionNumber = StandadizePartitionKey(projectName, procedureExecution.RevisionNumber);
            return CosmosDbContainer.InsertOrReplaceAsync(procedureExecution.RevisionNumber, procedureExecution.JobId, procedureExecution);
        }

        private string StandadizePartitionKey(string projectName, string partitionKey)
        {
            if (partitionKey.StartsWith(projectName + PrefixPartitionKey))
            {
                return partitionKey;
            }
            else
            {
                return (projectName + PrefixPartitionKey + partitionKey);
            }
        }
    }
}
