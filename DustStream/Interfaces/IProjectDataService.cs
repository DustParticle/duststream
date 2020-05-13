using DustStream.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IProjectDataService
    {
        public Task<IEnumerable<Project>> GetAllByDomainAsync(string domainString);
        public Task<Project> GetAsync(string domainString, string projectName);
        public Task InsertAsync(Project project);
        public Task InsertAsync(Project[] projects);
    }
}