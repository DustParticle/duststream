using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class RevisionDataService : IRevisionDataService
    {
        private readonly TableStorageOptions TableStorageConfig;

        public RevisionDataService(IOptions<TableStorageOptions> tableStorageOptions)
        {
            this.TableStorageConfig = tableStorageOptions.Value;
        }

        public Task<IEnumerable<Revision>> GetAllByProjectAsync(string projectName)
        {
            var tableStore = TableStorageHelper.GetRevisionTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetByPartitionKeyAsync(projectName);
        }

        public Task<Revision> GetAsync(string projectName, string revisionNumber)
        {
            var tableStore = TableStorageHelper.GetRevisionTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetRecordAsync(projectName, revisionNumber);
        }

        public Task InsertAsync(Revision revision)
        {
            var tableStore = TableStorageHelper.GetRevisionTableStore(TableStorageConfig.ConnectionString);
            return tableStore.InsertAsync(revision);
        }

        public Task InsertOrReplaceAsync(Revision revision)
        {
            var tableStore = TableStorageHelper.GetRevisionTableStore(TableStorageConfig.ConnectionString);
            return tableStore.InsertOrReplaceAsync(revision);
        }
    }
}
