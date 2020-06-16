using DustStream.Models;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IAzureDevOpsService
    {
        public Task<Revision> QueueBuild(AzureDevOpsSettings azureDevOpsSettings,
            QueueBuildRequest request, string accessToken);
    }
}