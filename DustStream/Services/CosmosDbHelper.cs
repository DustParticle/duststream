using System;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;
using DustStream.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.TeamFoundation;
using Newtonsoft.Json;
using System.Text;

namespace DustStream.Services
{
    public class CosmosDbHelper
    {
        private static readonly string DatabaseId = "duststream";
        private readonly Container CosmosDbContainer;

        public CosmosDbHelper(string connectionString, string containerString)
        {
            CosmosClient cosmosClient = new CosmosClient(connectionString, new CosmosClientOptions() { ApplicationName = "DustStream" });
            Database database = cosmosClient.GetDatabase(DatabaseId);
            CosmosDbContainer = database.GetContainer(containerString);
        }

        public async Task InsertAsync<T>(T item, string partition)
        {
            await this.CosmosDbContainer.CreateItemAsync<T>(item, new PartitionKey(partition));
        }

        public async Task InsertOrReplaceAsync<T>(string partitionString, string keyString, T item)
        {
            try
            {
                // Read the item to see if it exists.  
                ItemResponse<T> existedItem = await this.CosmosDbContainer.ReadItemAsync<T>(keyString, new PartitionKey(partitionString));

                // Replace the item
                existedItem = await this.CosmosDbContainer.ReplaceItemAsync<T>(item, keyString, new PartitionKey(partitionString));
            }
            catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                // Create an item in the container
                ItemResponse<T> itemResponse = await this.CosmosDbContainer.CreateItemAsync<T>(item, new PartitionKey(partitionString));
                Console.WriteLine("Created item in database with id: {0} Operation consumed {1} RUs.\n", keyString, itemResponse.RequestCharge);
            }
        }

        public async Task<IEnumerable<T>> QueryItemsAsync<T>(string queryString)
        {
            QueryDefinition queryDefinition = new QueryDefinition(queryString);
            FeedIterator<T> queryResultSetIterator = this.CosmosDbContainer.GetItemQueryIterator<T>(queryDefinition);

            List<T> items = new List<T>();
            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<T> currentResultSet = await queryResultSetIterator.ReadNextAsync();
                foreach (T item in currentResultSet)
                {
                    items.Add(item);
                }
            }

            return items;
        }

        public async Task<IEnumerable<T>> QueryItemsAsync<T>(string queryString, int itemsPerPage, string continuationToken)
        {
            QueryDefinition queryDefinition = new QueryDefinition(queryString);
            if ("null" == continuationToken)
            {
                continuationToken = null;
            }

            FeedIterator<T> queryResultSetIterator = this.CosmosDbContainer.GetItemQueryIterator<T>(queryDefinition, continuationToken,
            new QueryRequestOptions()
            {
                MaxItemCount = itemsPerPage
            });

            List<T> items = new List<T>();
            if (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<T> currentResultSet = await queryResultSetIterator.ReadNextAsync();

                foreach (T item in currentResultSet)
                {
                    items.Add(item);
                }
            }

            return items;
        }

        public async Task<Tuple<List<string>, int>> QueryTokensAsync<T>(string queryString, int itemsPerPage)
        {
            QueryDefinition queryDefinition = new QueryDefinition(queryString);
            int totalItems = 0;

            FeedIterator<T> queryResultSetIterator = this.CosmosDbContainer.GetItemQueryIterator<T>(queryDefinition, null,
            new QueryRequestOptions()
            {
                MaxItemCount = itemsPerPage
            });

            List<string> items = new List<string>();
            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<T> currentResultSet = await queryResultSetIterator.ReadNextAsync();

                totalItems += currentResultSet.Count;

                if (null != currentResultSet.ContinuationToken)
                {
                    items.Add(currentResultSet.ContinuationToken);
                }
            }

            return Tuple.Create(items, totalItems);
        }

        public async Task<T> ReadItemAsync<T>(string partitionString, string keyString)
        {
            try
            {
                ItemResponse<T> itemResponse = await this.CosmosDbContainer.ReadItemAsync<T>(keyString, new PartitionKey(partitionString));
                return itemResponse.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return default(T);
            }
        }
    }
}
