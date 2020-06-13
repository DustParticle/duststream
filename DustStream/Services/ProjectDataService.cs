using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class ProjectDataService : IProjectDataService
    {
        private TableStorageOptions TableStorageConfig;

        public ProjectDataService(IOptions<TableStorageOptions> tableStorageOptions)
        {
            this.TableStorageConfig = tableStorageOptions.Value;
        }

        public Task<IEnumerable<Project>> GetAllByDomainAsync(string domainString)
        {
            var tableStore = TableStorageHelper.GetProjectTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetByPartitionKeyAsync(domainString);
        }

        public Task<Project> GetAsync(string domainString, string projectName)
        {
            var tableStore = TableStorageHelper.GetProjectTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetRecordAsync(domainString, projectName);
        }

        public Task InsertAsync(Project project)
        {
            var tableStore = TableStorageHelper.GetProjectTableStore(TableStorageConfig.ConnectionString);
            return tableStore.InsertAsync(project);
        }

        public Task UpdateAsync(Project project)
        {
            var tableStore = TableStorageHelper.GetProjectTableStore(TableStorageConfig.ConnectionString);
            return tableStore.UpdateAsync(project);
        }

        public Task ReplaceAsync(Project project)
        {
            var tableStore = TableStorageHelper.GetProjectTableStore(TableStorageConfig.ConnectionString);
            return tableStore.InsertOrReplaceAsync(project);
        }
    }
}
