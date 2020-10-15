using DustStream.Interfaces;
using DustStream.Models;
using Microsoft.VisualStudio.Services.OAuth;
using Microsoft.VisualStudio.Services.WebApi;
using Microsoft.TeamFoundation.Build.WebApi;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DustStream.Services
{
    public class AzureDevOpsService : IAzureDevOpsService
    {
        private class BuildDefinition
        {
            public string Id { get; set; }
        }

        private class TriggerBuildRequest
        {
            public string Parameters { get; set; }
            public BuildDefinition Definition { get; set; }
        }

        public AzureDevOpsService()
        {
        }

        public async Task<Revision> QueueBuild(AzureDevOpsSettings azureDevOps,
            QueueBuildRequest queueBuildRequest, string accessToken)
        {
            var credentials = new VssOAuthAccessTokenCredential(accessToken);
            var connection = new VssConnection(
                new Uri($"https://dev.azure.com/{azureDevOps.Organization}"),
                credentials);
            try
            {
                var buildClient = connection.GetClient<BuildHttpClient>();
                var definition = await buildClient.GetDefinitionAsync(azureDevOps.Project, int.Parse(azureDevOps.BuildDefinition));
                Dictionary<string, string> parameters = queueBuildRequest.Variables.ToDictionary(v => v.Key, v => v.Value);
                Build build = new Build
                {
                    Definition = definition,
                    Project = definition.Project,
                    Parameters = JsonConvert.SerializeObject(parameters)
                };
                var response = await buildClient.QueueBuildAsync(build);

                var revision = new Revision()
                {
                    RevisionNumber = response.Id.ToString(),
                    Requestor = response.RequestedBy.DisplayName,
                    CreatedTime = DateTimeOffset.Now
                };
                
                return revision;
            }
            catch (Exception)
            {
                return null;
            }
        }

        private HttpClient GetHttpClientAsync(AzureDevOpsSettings azureDevOps, string accessToken)
        {
            // Trigger Azure DevOps build
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            httpClient.BaseAddress = new Uri($"https://dev.azure.com/{azureDevOps.Organization}/{azureDevOps.Project}/_apis/");
            return httpClient;
        }

        public async Task<Release> QueueRelease(AzureDevOpsSettings azureDevOps,
            QueueReleaseRequest queueReleaseRequest, string accessToken, string projectName,string revisionNumber, string commitNumber)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>()
            {
                { "DUSTPARTICLE_PROJECT", azureDevOps.Project },
                { "DUSTPARTICLE_PIPELINE", azureDevOps.ArtifactResourcePipeline},
                { "DUSTPARTICLE_BUILDID", revisionNumber },
                { "DUSTPARTICLE_SOURCEVERSION", commitNumber },
                { "DUSTPARTICLE_RELEASETAG", queueReleaseRequest.Name }
            };
            TriggerBuildRequest request = new TriggerBuildRequest()
            {
                Parameters = JsonConvert.SerializeObject(parameters),
                Definition = new BuildDefinition() { Id = azureDevOps.ReleaseDefinition }
            };

            string url = "build/builds?api-version=5.1";
            HttpClient httpClient = GetHttpClientAsync(azureDevOps, accessToken);
            var response = await httpClient.PostAsJsonAsync(url, request);

            if (response.IsSuccessStatusCode)
            {
                Release returnRelease = new Release();
                returnRelease.Status = "InProgress";
                returnRelease.ProjectName = projectName;
                returnRelease.RevisionNumber = revisionNumber;
                returnRelease.ReleaseLabel = queueReleaseRequest.Name;
                returnRelease.ReleaseNotes = queueReleaseRequest.ReleaseNotes;
                return returnRelease;
            }
            return null;
        }
    }
}
