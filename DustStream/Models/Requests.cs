namespace DustStream.Models
{
    public class QueueBuildRequest
    {
        public string Branch { get; set; }
        public string Commit { get; set; }
        public Variable[] Variables { get; set; }
    }

    public class QueueAzureBuildRequest : QueueBuildRequest
    {
        public string AzurePat { get; set; }
    }
}
