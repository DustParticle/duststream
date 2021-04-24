using DustStream.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface ICdbProjectDataService
    {
        public Task<IEnumerable<Project>> GetAllByDomainAsync(string domainString);
        public Task<Project> GetAsync(string domainString, string projectName);
        public Task InsertAsync(Project project);
        public Task UpdateAsync(Project project);
        public Task ReplaceAsync(Project project);
    }
}