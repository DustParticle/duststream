$tableName = $args[0]
$targetDatabaseName = $args[1]
$sourceConnectionString = $args[2]
$targetConnectionString = $args[3] + ";Database=" + $targetDatabaseName
$singleContainerFile = $args[4]

$tableFileJson = $tableName + ".json"

# Convert table storage data to JSON
$argumentString = "/s:AzureTable /s.ConnectionString:" + $sourceConnectionString + " /s.Table:" + $tableName + " /t:JsonFile /t.File:" + $tableFileJson + " /t.Overwrite"
Start-Process -FilePath ".\dt1.8.3\drop\dt.exe" -ArgumentList $argumentString -Wait

# Modify PartitionKey to format of single container (combine table name and partition key)
$commonDataSet = @()
if (Test-Path $singleContainerFile -PathType leaf)
{
    $commonDataSet = Get-Content $singleContainerFile | ConvertFrom-Json
}

$specificDataSet = Get-Content $tableFileJson | ConvertFrom-Json
foreach ($item in $specificDataSet)
{
    $item.PartitionKey = $tableName + "Prefix-" + $item.PartitionKey
    $commonDataSet += $item
}
$commonDataSet | ConvertTo-Json | Out-File $singleContainerFile
