using System;

namespace DustStream.Models
{
    public class Release
    {
        public Release()
        {

        }

        public Release(string projectName, string revisionNumber, string releaseLabel, string status)
        {
            ProjectName = projectName;
            RevisionNumber = revisionNumber;
            ReleaseLabel = releaseLabel;
            Status = status;
        }

        // Required attributes
        // Partition
        public string ProjectName { get; set; }
        // Row
        public string RevisionNumber { get; set; }
        public string ReleaseLabel { get; set; }
        public string Status { get; set; }

        // Optional attributes
        public string ReleaseNotes { get; set; }
        public string ReleaseDataLink { get; set; }
    }
}
