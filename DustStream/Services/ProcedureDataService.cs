using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class ProcedureDataService : IProcedureDataService
    {
        private readonly TableStorageOptions TableStorageConfig;

        public ProcedureDataService(IOptions<TableStorageOptions> tableStorageOptions)
        {
            this.TableStorageConfig = tableStorageOptions.Value;
        }

        public Task<IEnumerable<Procedure>> GetAllByProjectAsync(string projectName)
        {
            var tableStore = TableStorageHelper.GetProcedureTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetByPartitionKeyAsync(projectName);
        }

        public Task<Procedure> GetAsync(string projectName, string procedureName)
        {
            var tableStore = TableStorageHelper.GetProcedureTableStore(TableStorageConfig.ConnectionString);
            return tableStore.GetRecordAsync(projectName, procedureName);
        }

        public Task InsertAsync(Procedure procedure)
        {
            var tableStore = TableStorageHelper.GetProcedureTableStore(TableStorageConfig.ConnectionString);
            return tableStore.InsertAsync(procedure);
        }
    }
}
