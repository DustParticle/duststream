using DustStream.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IRevisionDataService
    {
        public Task<IEnumerable<Revision>> GetAllByProjectAsync(string projectName, int itemsPerPage, string continuationToken);
        public Task<Tuple<List<string>, int>> GetTokensByProjectAsync(string projectName, int itemsPerPages);
        public Task<Revision> GetAsync(string projectName, string revisionNumber);
        public Task InsertAsync(Revision revision);
        public Task UpdateAsync(Revision revision);
    }
}