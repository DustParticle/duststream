using Newtonsoft.Json;
using System;

namespace DustStream.Models
{
    public class ProcedureExecution
    {
        public ProcedureExecution()
        {

        }

        public ProcedureExecution(string revisionNumber, string jobId, string procedureShortName, string ciConfiguration, string status)
        {
            RevisionNumber = revisionNumber;
            JobId = jobId;

            ProcedureShortName = procedureShortName;
            CIConfiguration = ciConfiguration;
            Status = status;
        }

        // Required attributes
        // Partition
        [JsonProperty("PartitionKey")]
        public string RevisionNumber { get; set; }
        // Row
        [JsonProperty("id")]
        public string JobId { get; set; }
        public string ProcedureShortName { get; set; }
        public string CIConfiguration { get; set; }
        public string Status { get; set; }
        [JsonProperty("SourceTimestamp")]
        public DateTimeOffset Timestamp { get; set; }

        // Optional attributes
        public string DownloadLink { get; set; }
        public string ConsoleLog { get; set; }
        public string Machine { get; set; }
        public string Description { get; set; }
    }
}
