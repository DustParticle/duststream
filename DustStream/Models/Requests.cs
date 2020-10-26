namespace DustStream.Models
{
    public class Variable
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    public class QueueBuildRequest
    {
        public string Branch { get; set; }
        public string Commit { get; set; }
        public Variable[] Variables { get; set; }
    }

    public class QueueReleaseRequest
    {
        public string Name { get; set; }
        public string ReleaseNotes { get; set; }
    }
}
