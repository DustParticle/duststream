$tableName = $args[0]
$targetDatabaseName = $args[1]
$sourceConnectionString = $args[2]
$targetConnectionString = $args[3] + ";Database=" + $targetDatabaseName

$argumentString = "/s:AzureTable /s.ConnectionString:" + $sourceConnectionString + " /s.Table:" + $tableName + " /t:DocumentDB /t.ConnectionString:" + $targetConnectionString + " /t.IdField:RowKey /t.Collection:" + $tableName + " /t.PartitionKey:/PartitionKey"
Start-Process -FilePath ".\dt1.8.3\drop\dt.exe" -ArgumentList $argumentString
