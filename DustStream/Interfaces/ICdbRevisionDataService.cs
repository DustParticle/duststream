using DustStream.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface ICdbRevisionDataService
    {
        public Task<IEnumerable<Revision>> GetAllByProjectAsync(string projectName, int itemsPerPage, string continuationToken);
        public Task<IEnumerable<string>> GetTokensByProjectAsync(string projectName, int itemsPerPages);
        public Task<Revision> GetAsync(string projectName, string revisionNumber);
        public Task InsertAsync(Revision revision);
        public Task UpdateAsync(Revision revision);
    }
}