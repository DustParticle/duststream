using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class ReleaseDataService : IReleaseDataService
    {
        private readonly TableStorageOptions TableStorageConfig;

        public ReleaseDataService(IOptions<TableStorageOptions> tableStorageOptions)
        {
            this.TableStorageConfig = tableStorageOptions.Value;
        }

        public Task<IEnumerable<Release>> GetAllByProjectAsync(string projectName)
        {
            var tableStore = TableStorageHelper.GetReleaseTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetByPartitionKeyAsync(projectName);
        }

        public Task<Release> GetAsync(string projectName, string revisionNumber)
        {
            var tableStore = TableStorageHelper.GetReleaseTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetRecordAsync(projectName, revisionNumber);
        }

        public Task InsertOrReplaceAsync(Release release)
        {
            var tableStore = TableStorageHelper.GetReleaseTableStore(TableStorageConfig.ConnectionString);
            return tableStore.InsertOrReplaceAsync(release);
        }
    }
}
