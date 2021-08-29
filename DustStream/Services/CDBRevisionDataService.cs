using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbRevisionDataService : IRevisionDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string PrefixPartitionKey = "RevisionsPrefix-";

        public CdbRevisionDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;

            // Beware: This source code is duplicated since we are use DomainString for single container to save cost
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, this.CosmosDbConfig.DomainString, this.CosmosDbConfig.DomainString);
        }

        public Task<IEnumerable<Revision>> GetAllByProjectAsync(string projectName, int itemsPerPage, string continuationToken)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{StandadizePartitionKey(projectName)}' ORDER BY c.CreatedTime DESC";
            return CosmosDbContainer.QueryItemsAsync<Revision>(queryString, itemsPerPage, continuationToken);
        }

        public Task<Tuple<List<string>, int>> GetTokensByProjectAsync(string projectName, int itemsPerPage)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{StandadizePartitionKey(projectName)}' ORDER BY c.CreatedTime DESC";
            return CosmosDbContainer.QueryTokensAsync<Revision>(queryString, itemsPerPage);
        }

        public Task<Revision> GetAsync(string projectName, string revisionNumber)
        {
            return CosmosDbContainer.ReadItemAsync<Revision>(StandadizePartitionKey(projectName), revisionNumber);
        }

        public Task InsertAsync(Revision revision)
        {
            revision.ProjectName = StandadizePartitionKey(revision.ProjectName);
            return CosmosDbContainer.InsertAsync(revision, revision.ProjectName);
        }

        public Task UpdateAsync(Revision revision)
        {
            revision.ProjectName = StandadizePartitionKey(revision.ProjectName);
            return CosmosDbContainer.InsertOrReplaceAsync(revision.ProjectName, revision.RevisionNumber, revision);
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
