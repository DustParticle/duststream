using DustStream.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface ICdbReleaseDataService
    {
        public Task<IEnumerable<Release>> GetAllByProjectAsync(string projectName);
        public Task<Release> GetAsync(string projectName, string revisionNumber);
        public Task InsertOrReplaceAsync(Release release);
    }
}