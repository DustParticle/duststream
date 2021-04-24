using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbProjectDataService : ICdbProjectDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string ContainerName = "Projects";

        public CdbProjectDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, ContainerName);
        }

        public Task<IEnumerable<Project>> GetAllByDomainAsync(string domainString)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{domainString}'";
            return CosmosDbContainer.QueryItemsAsync<Project>(queryString);
        }

        public Task<Project> GetAsync(string domainString, string projectName)
        {
            return CosmosDbContainer.ReadItemAsync<Project>(domainString, projectName);
        }

        public Task InsertAsync(Project project)
        {
            return CosmosDbContainer.InsertAsync(project, project.DomainString);
        }

        public Task UpdateAsync(Project project)
        {
            return CosmosDbContainer.InsertOrReplaceAsync(project.DomainString, project.Name, project);
        }

        public Task ReplaceAsync(Project project)
        {
            return CosmosDbContainer.InsertOrReplaceAsync(project.DomainString, project.Name, project);
        }
    }
}
