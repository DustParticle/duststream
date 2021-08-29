using Newtonsoft.Json;
using System;

namespace DustStream.Models
{
    public class Revision
    {
        public Revision()
        {

        }

        public Revision(string projectName, string revisionNumber, string commitSet, string commitPayload)
        {
            ProjectName = projectName;
            CommitSet = commitSet;
            CommitPayload = commitPayload;
            RevisionNumber = revisionNumber;
        }

        // Required attributes
        // Partition
        [JsonProperty("PartitionKey")]
        public string ProjectName { get; set; }
        // Row
        [JsonProperty("id")]
        public string RevisionNumber { get; set; }
        public string CommitSet { get; set; }
        public string CommitPayload { get; set; }

        // Optional attributes
        public DateTimeOffset CreatedTime { get; set; }
        [JsonProperty("SourceTimestamp")]
        public DateTimeOffset Timestamp { get; set; }
        public string Description { get; set; }
        public string Requestor { get; set; }
    }
}
