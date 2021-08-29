$targetDatabaseName = $args[0]
$targetConnectionString = $args[1] + ";Database=" + $targetDatabaseName
$singleContainerFile = $args[2]

# Convert JSON to CosmosDB single container
$argumentString = "/s:JsonFile /s.Files:" + $singleContainerFile + " /t:DocumentDB /t.ConnectionString:" + $targetConnectionString + " /t.IdField:RowKey /t.Collection:" + $targetDatabaseName + " /t.PartitionKey:/PartitionKey"
Start-Process -FilePath ".\dt1.8.3\drop\dt.exe" -ArgumentList $argumentString -Wait
