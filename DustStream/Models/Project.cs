using Microsoft.Azure.Cosmos.Table;
using Newtonsoft.Json;
using System;

namespace DustStream.Models
{
    public class AzureDevOpsSettings
    {
        public string Organization { get; set; }
        public string Project { get; set; }
        public string BuildDefinition { get; set; }
        public string ReleaseDefinition { get; set; }
        public string ArtifactResourcePipeline { get; set; }
    }

    public class Project
    {
        public Project()
        {
        }

        public Project(string domainString, string name, string description)
        {
            DomainString = domainString;
            Name = name;
            Description = description;
        }

        // Partition
        [JsonProperty("PartitionKey")]
        public string DomainString { get; set; }
        // Row
        [JsonProperty("id")]
        public string Name { get; set; }
        public string Description { get; set; }
        [JsonProperty("SourceTimestamp")]
        public DateTimeOffset Timestamp { get; set; }

        [JsonIgnore]
        public string ApiKey { get; set; }
        [JsonProperty("AzureDevOpsJson")]
        private string AzureDevOpsString { get; set; }
        public AzureDevOpsSettings AzureDevOps
        {
            get
            {
                if (this.AzureDevOpsString != null)
                {
                    return JsonConvert.DeserializeObject<AzureDevOpsSettings>(this.AzureDevOpsString);
                }
                else
                {
                    return null;
                }
            }

            set
            {
                this.AzureDevOpsString = JsonConvert.SerializeObject(value);
            }
        }
        [JsonProperty("VariablesJson")]
        public string VariablesDef { get; set; }
        public string HashedApiKey { get; set; }
    }
}
