using DustStream.Models;
using TableStorage.Abstractions.POCO;

namespace DustStream.Services
{
    public class TableStorageHelper
    {
        private static readonly string ProjectTable = "Projects";
        private static readonly string RevisionTable = "Revisions";
        private static readonly string ProcedureTable = "Procedures";
        private static readonly string ProcedureExecutionTableSuffix = "ProcedureExecutions";

        public static PocoTableStore<Project, string, string> GetProjectTableStore(string connectionString)
        {
            return new PocoTableStore<Project, string, string>(ProjectTable, connectionString,
                c => c.DomainString, c => c.Name);
        }

        public static PocoTableStore<Revision, string, string> GetRevisionTableStore(string connectionString)
        {
            return new PocoTableStore<Revision, string, string>(RevisionTable, connectionString,
                r => r.ProjectName, r => r.RevisionNumber);
        }

        public static PocoTableStore<Procedure, string, string> GetProcedureTableStore(string connectionString)
        {
            return new PocoTableStore<Procedure, string, string>(ProcedureTable, connectionString,
                r => r.ProjectName, r => r.ShortName);
        }

        public static PocoTableStore<ProcedureExecution, string, string> GetProcedureExecutionTableStore(string connectionString, string projectName)
        {
            return new PocoTableStore<ProcedureExecution, string, string>(projectName + ProcedureExecutionTableSuffix, connectionString,
                r => r.RevisionNumber, r => r.JobId);
        }
    }
}
