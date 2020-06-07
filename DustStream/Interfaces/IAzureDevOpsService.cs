using DustStream.Models;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IAzureDevOpsService
    {
        public Task<Revision> TriggerBuild(AzureDevOpsSettings azureDevOpsSettings,
            string branch, string commit, Variable[] variables);
    }
}