using DustStream.Interfaces;
using DustStream.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
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

        public async Task<Revision> TriggerBuild(AzureDevOpsSettings azureDevOps,
            string branch, string commit, Variable[] variables)
        {
            Dictionary<string, string> parameters = variables.ToDictionary(v => v.Key, v => v.Value);
            TriggerBuildRequest request = new TriggerBuildRequest()
            {
                Parameters = JsonConvert.SerializeObject(parameters),
                Definition = new BuildDefinition() { Id = azureDevOps.BuildDefinition }
            };

            string url = "build/builds?api-version=5.1";
            HttpClient httpClient = GetHttpClient(azureDevOps);
            var response = await httpClient.PostAsJsonAsync(url, request);

            if (response.IsSuccessStatusCode)
            {
                // TODO: parse response to create the Revision object
                return new Revision();
            }
            return null;
        }

        private HttpClient GetHttpClient(AzureDevOpsSettings azureDevOps)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                Convert.ToBase64String(Encoding.UTF8.GetBytes($"{azureDevOps.Username}:{azureDevOps.AccessToken}")));
            httpClient.BaseAddress = new Uri($"https://dev.azure.com/{azureDevOps.Organization}/{azureDevOps.Project}/_apis/");
            return httpClient;
        }
    }
}
