using DustStream.Models;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IAzureDevOpsService
    {
        public Task<Revision> QueueBuild(AzureDevOpsSettings azureDevOpsSettings,
            QueueBuildRequest request, string accessToken);

        public Task<Revision> QueueRelease(AzureDevOpsSettings azureDevOpsSettings,
            QueueReleaseRequest request, string accessToken, string revisionNumber, string commitNumber);
    }
}