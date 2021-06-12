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
        private static readonly string ContainerName = "Releases";

        public CdbReleaseDataService(IOptions<CosmosDbOptions> cosmosDbOptions)
        {
            this.CosmosDbConfig = cosmosDbOptions.Value;
            this.CosmosDbContainer = new CosmosDbHelper(this.CosmosDbConfig.ConnectionString, ContainerName);
        }

        public Task<IEnumerable<Release>> GetAllByProjectAsync(string projectName)
        {
            string queryString = $"SELECT * FROM c WHERE c.PartitionKey = '{projectName}'";
            return CosmosDbContainer.QueryItemsAsync<Release>(queryString);
        }

        public Task<Release> GetAsync(string projectName, string revisionNumber)
        {
            return CosmosDbContainer.ReadItemAsync<Release>(projectName, revisionNumber);
        }

        public Task InsertOrReplaceAsync(Release release)
        {
            return CosmosDbContainer.InsertOrReplaceAsync(release.ProjectName, release.RevisionNumber, release);
        }
    }
}
