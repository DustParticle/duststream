using System;
using System.Text.Json.Serialization;

namespace DustStream.Models
{
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
        [JsonIgnore]
        public string HashedApiKey { get; set; }
    }
}
