using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbProcedureDataService : IProcedureDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string ContainerName = "Procedures";

        public CdbProcedureDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, ContainerName);
        }

        public Task<IEnumerable<Procedure>> GetAllByProjectAsync(string projectName)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{projectName}' ORDER BY c.CreatedTime ASC";
            return CosmosDbContainer.QueryItemsAsync<Procedure>(queryString);
        }

        public Task<Procedure> GetAsync(string projectName, string procedureName)
        {
            return CosmosDbContainer.ReadItemAsync<Procedure>(projectName, procedureName);
        }

        public Task InsertAsync(Procedure procedure)
        {
            return CosmosDbContainer.InsertAsync(procedure, procedure.ProjectName);
        }
    }
}
