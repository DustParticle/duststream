using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbProjectDataService : IProjectDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string PrefixPartitionKey = "ProjectsPrefix-";

        public CdbProjectDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;

            // Beware: This source code is duplicated since we are use DomainString for single container to save cost
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, this.CosmosDbConfig.DomainString, this.CosmosDbConfig.DomainString);
        }

        public Task<IEnumerable<Project>> GetAllByDomainAsync(string domainString)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{StandadizePartitionKey(domainString)}'";
            return CosmosDbContainer.QueryItemsAsync<Project>(queryString);
        }

        public Task<Project> GetAsync(string domainString, string projectName)
        {
            return CosmosDbContainer.ReadItemAsync<Project>(StandadizePartitionKey(domainString), projectName);
        }

        public Task InsertAsync(Project project)
        {
            project.DomainString = StandadizePartitionKey(project.DomainString);
            return CosmosDbContainer.InsertAsync(project, project.DomainString);
        }

        public Task UpdateAsync(Project project)
        {
            project.DomainString = StandadizePartitionKey(project.DomainString);
            return CosmosDbContainer.InsertOrReplaceAsync(project.DomainString, project.Name, project);
        }

        public Task ReplaceAsync(Project project)
        {
            project.DomainString = StandadizePartitionKey(project.DomainString);
            return CosmosDbContainer.InsertOrReplaceAsync(project.DomainString, project.Name, project);
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
