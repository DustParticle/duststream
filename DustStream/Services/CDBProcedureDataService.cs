using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbProcedureDataService : IProcedureDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string PrefixPartitionKey = "ProceduresPrefix-";

        public CdbProcedureDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;

            // Beware: This source code is duplicated since we are use DomainString for single container to save cost
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, this.CosmosDbConfig.DomainString, this.CosmosDbConfig.DomainString);
        }

        public Task<IEnumerable<Procedure>> GetAllByProjectAsync(string projectName)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{StandadizePartitionKey(projectName)}' ORDER BY c.CreatedTime ASC";
            return CosmosDbContainer.QueryItemsAsync<Procedure>(queryString);
        }

        public Task<Procedure> GetAsync(string projectName, string procedureName)
        {
            return CosmosDbContainer.ReadItemAsync<Procedure>(StandadizePartitionKey(projectName), procedureName);
        }

        public Task InsertAsync(Procedure procedure)
        {
            procedure.ProjectName = StandadizePartitionKey(procedure.ProjectName);
            return CosmosDbContainer.InsertAsync(procedure, procedure.ProjectName);
        }

        private string StandadizePartitionKey(string partitionKey)
        {
            if (partitionKey.StartsWith(PrefixPartitionKey))
            {
                return partitionKey;
            }
            else
            {
                return (PrefixPartitionKey + partitionKey);
            }
        }
    }
}
