using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbRevisionDataService : ICdbRevisionDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string ContainerName = "Revisions";

        public CdbRevisionDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, ContainerName);
        }

        public Task<IEnumerable<Revision>> GetAllByProjectAsync(string projectName, int itemsPerPage, string continuationToken)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{projectName}' ORDER BY c.CreatedTime DESC";
            return CosmosDbContainer.QueryItemsAsync<Revision>(queryString, itemsPerPage, continuationToken);
        }

        public Task<IEnumerable<string>> GetTokensByProjectAsync(string projectName, int itemsPerPage)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{projectName}' ORDER BY c.CreatedTime DESC";
            return CosmosDbContainer.QueryTokensAsync<Revision>(queryString, itemsPerPage);
        }

        public Task<Revision> GetAsync(string projectName, string revisionNumber)
        {
            return CosmosDbContainer.ReadItemAsync<Revision>(projectName, revisionNumber);
        }

        public Task InsertAsync(Revision revision)
        {
            return CosmosDbContainer.InsertAsync(revision, revision.ProjectName);
        }

        public Task UpdateAsync(Revision revision)
        {
            return CosmosDbContainer.InsertOrReplaceAsync(revision.ProjectName, revision.RevisionNumber, revision);
        }
    }
}
