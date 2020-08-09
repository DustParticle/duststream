using DustStream.Models;
using System.Threading.Tasks;

namespace DustStream.Interfaces
{
    public interface IAzureDevOpsService
    {
        public Task<Revision> QueueBuild(AzureDevOpsSettings azureDevOpsSettings,
            QueueBuildRequest request, string accessToken);

        public Task<Release> QueueRelease(AzureDevOpsSettings azureDevOpsSettings,
            QueueReleaseRequest request, string accessToken, string projectName, string revisionNumber, string commitNumber);
    }
}