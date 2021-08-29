$sourceConnectionString = "UseDevelopmentStorage=true"
$targetConnectionString = "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="

$targetDatabaseName = "DustStream"
$singleContainerFile = "./singleContainerData.json"

#Delete singleContainerData.json if it is existed
if (Test-Path $singleContainerFile -PathType leaf)
{
    Remove-Item $singleContainerFile
}

$tableName = "Releases"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile

$tableName = "Revisions"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile

$tableName = "Procedures"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile

$tableName = "Projects"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile

$tableName = "DustStreamProcedureExecutions"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile
$tableName = "SsdSimProcedureExecutions"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile
$tableName = "TestProcedureExecutions"
.\table_storage_to_json.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString $singleContainerFile



.\json_to_cosmosdb.ps1 $targetDatabaseName $targetConnectionString $singleContainerFile

