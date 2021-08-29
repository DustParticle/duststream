using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class CdbReleaseDataService : IReleaseDataService
    {
        private readonly CosmosDbOptions CosmosDbConfig;
        private readonly CosmosDbHelper CosmosDbContainer;
        private static readonly string PrefixPartitionKey = "ReleasesPrefix-";

        public CdbReleaseDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;

            // Beware: This source code is duplicated since we are use DomainString for single container to save cost
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, this.CosmosDbConfig.DomainString, this.CosmosDbConfig.DomainString);
        }

        public Task<IEnumerable<Release>> GetAllByProjectAsync(string projectName)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{StandadizePartitionKey(projectName)}'";
            return CosmosDbContainer.QueryItemsAsync<Release>(queryString);
        }

        public Task<Release> GetAsync(string projectName, string revisionNumber)
        {
            return CosmosDbContainer.ReadItemAsync<Release>(StandadizePartitionKey(projectName), revisionNumber);
        }

        public Task InsertOrReplaceAsync(Release release)
        {
            release.ProjectName = StandadizePartitionKey(release.ProjectName);
            return CosmosDbContainer.InsertOrReplaceAsync(release.ProjectName, release.RevisionNumber, release);
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
