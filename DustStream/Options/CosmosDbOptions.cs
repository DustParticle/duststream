namespace DustStream.Options
{
    public class CosmosDbOptions
    {
        public CosmosDbOptions()
        {
            ConnectionString = "";
            DomainString = "";
        }

        public string ConnectionString { get; set; }
        public string DomainString { get; set; }
    }
}
