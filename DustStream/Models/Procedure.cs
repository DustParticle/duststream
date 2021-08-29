using Newtonsoft.Json;
using System;

namespace DustStream.Models
{
    public class Procedure
    {
        public Procedure()
        {

        }

        public Procedure(string projectName, string shortName)
        {
            ProjectName = projectName;
            ShortName = shortName;
        }

        // Required attributes
        // Partition
        [JsonProperty("PartitionKey")]
        public string ProjectName { get; set; }
        // Row
        [JsonProperty("id")]
        public string ShortName { get; set; }

        // Optional attributes
        public string LongName { get; set; }
        public DateTimeOffset CreatedTime { get; set; }
        [JsonProperty("SourceTimestamp")]
        public DateTimeOffset Timestamp { get; set; }
        public string Description { get; set; }
    }
}
