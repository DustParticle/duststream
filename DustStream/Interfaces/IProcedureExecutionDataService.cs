using DustStream.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IProcedureExecutionDataService
    {
        public Task<IEnumerable<ProcedureExecution>> GetAllByRNPAsync(string projectName, string revisionNumber, string procedureName);
        public Task InsertOrReplaceAsync(string projectName, ProcedureExecution procedureExecution);
    }
}