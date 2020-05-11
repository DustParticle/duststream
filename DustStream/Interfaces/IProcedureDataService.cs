using DustStream.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IProcedureDataService
    {
        public Task<IEnumerable<Procedure>> GetAllByProjectAsync(string projectName);
        public Task<Procedure> GetAsync(string projectName, string procedureName);
        public Task InsertAsync(Procedure procedure);
    }
}