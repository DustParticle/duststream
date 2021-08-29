$targetDatabaseName = "duststream"
$sourceConnectionString = "UseDevelopmentStorage=true"
$targetConnectionString = "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="

$tableName = "Releases"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString

$tableName = "Revisions"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString

$tableName = "DustStreamProcedureExecutions"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString

$tableName = "Procedures"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString

$tableName = "Projects"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString

$tableName = "SsdSimProcedureExecutions"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString
$tableName = "TestProcedureExecutions"
.\migrate_online.ps1 $tableName $targetDatabaseName $sourceConnectionString $targetConnectionString