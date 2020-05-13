namespace DustStream.Options
{
    public class TableStorageOptions
    {
        public TableStorageOptions()
        {
            ConnectionString = "";
            DomainString = "";
        }

        public string ConnectionString { get; set; }
        public string DomainString { get; set; }
    }
}
