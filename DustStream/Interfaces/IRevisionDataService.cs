using DustStream.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IRevisionDataService
    {
        public Task<IEnumerable<Revision>> GetAllByProjectAsync(string projectName);
        public Task<Revision> GetAsync(string projectName, string revisionNumber);
        public Task InsertAsync(Revision revision);
    }
}