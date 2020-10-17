using System;
using System.Text.Json.Serialization;

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
        [JsonIgnore]
        public string DomainString { get; set; }
        // Row
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        // Ignore this property in table store
        public string ApiKey { get; set; }
        public AzureDevOpsSettings AzureDevOps { get; set; }
        public string VariablesDef { get; set; }
        [JsonIgnore]
        public string HashedApiKey { get; set; }
    }
}
