using DustStream.Interfaces;
using DustStream.Models;
using DustStream.Options;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class ProcedureExecutionDataService : IProcedureExecutionDataService
    {
        private readonly TableStorageOptions TableStorageConfig;

        public ProcedureExecutionDataService(IOptions<TableStorageOptions> tableStorageOptions)
        {
            this.TableStorageConfig = tableStorageOptions.Value;
        }

        public async Task<IEnumerable<ProcedureExecution>> GetAllByRNPAsync(string projectName, string revisionNumber, string procedureName)
        {
            var tableStore = TableStorageHelper.GetProcedureExecutionTableStore(TableStorageConfig.ConnectionString, projectName);
            IEnumerable<ProcedureExecution> procedureExecutions = await tableStore.GetByPartitionKeyAsync(revisionNumber);
            procedureExecutions = procedureExecutions.Where(pe => pe.ProcedureShortName == procedureName);
            return procedureExecutions;
        }

        public Task InsertOrReplaceAsync(string projectName, ProcedureExecution procedureExecution)
        {
            var tableStore = TableStorageHelper.GetProcedureExecutionTableStore(TableStorageConfig.ConnectionString, projectName);
            return tableStore.InsertOrReplaceAsync(procedureExecution);
        }
    }
}
