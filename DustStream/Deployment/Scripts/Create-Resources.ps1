#Requires -Version 6

Param(
    [string] $name,
	[string] $resourceGroup,
    [string] $location,
    [string] $parametersFile,
	[string] $projDir = $(Get-Location),
	[string] $logFile = $(Join-Path $PSScriptRoot .. "deploy_log.txt")
)

# Reset log file
if (Test-Path $logFile) {
	Clear-Content $logFile -Force | Out-Null
}
else {
	New-Item -Path $logFile | Out-Null
}

# Check for AZ CLI and confirm version
if (Get-Command az -ErrorAction SilentlyContinue) {
    $azcliversionoutput = az -v
    [regex]$regex = '(\d{1,3}.\d{1,3}.\d{1,3})'
    [version]$azcliversion = $regex.Match($azcliversionoutput[0]).value
    [version]$minversion = '2.0.72'

    if ($azcliversion -ge $minversion) {
        $azclipassmessage = "AZ CLI passes minimum version. Current version is $azcliversion"
        Write-Debug $azclipassmessage
        $azclipassmessage | Out-File -Append -FilePath $logfile
    }
    else {
        $azcliwarnmessage = "You are using an older version of the AZ CLI, `
    please ensure you are using version $minversion or newer. `
    The most recent version can be found here: http://aka.ms/installazurecliwindows"
        Write-Warning $azcliwarnmessage
        $azcliwarnmessage | Out-File -Append -FilePath $logfile
    }
}
else {
    $azclierrormessage = 'AZ CLI not found. Please install latest version.'
    Write-Error $azclierrormessage
    $azclierrormessage | Out-File -Append -FilePath $logfile
}


if (-not (Test-Path (Join-Path $projDir 'appsettings.json')))
{
	Write-Host "! Could not find an 'appsettings.json' file in the current directory." -ForegroundColor Red
	Write-Host "+ Please re-run this script from your project directory." -ForegroundColor Magenta
	Break
}

# Get mandatory parameters
if (-not $name) {
    $name = Read-Host "? Name (used as default name for resource group and deployed resources)"
}

if (-not $resourceGroup) {
	$resourceGroup = $name
}

if (-not $location) {
    $location = Read-Host "? Azure resource group region"
}

#if (-not $appPassword) {
#    $appPassword = Read-Host "? Password for MSA app registration (must be at least 16 characters long, contain at least 1 special character, and contain at least 1 numeric character)"
#}

if (-not $appId) {
	# Create app registration
	$app = (az ad app create `
		--display-name $name `
		--available-to-other-tenants 'false'`
		--reply-urls 'https://localhost:44300' `
        --output json)

	# Retrieve AppId
	if ($app) {
		$appId = ($app | ConvertFrom-Json) | Select-Object -ExpandProperty appId
	}

	if(-not $appId) {
		Write-Host "! Could not provision Microsoft App Registration automatically. Review the log for more information." -ForegroundColor Red
		Write-Host "! Log: $($logFile)" -ForegroundColor Red
		Write-Host "+ Provision an app manually in the Azure Portal, then try again providing the -appId and -appPassword arguments. See https://aka.ms/vamanualappcreation for more information." -ForegroundColor Magenta
		Break
	}
}

# Get timestamp
$timestamp = Get-Date -f MMddyyyyHHmmss

# Create resource group
Write-Host "> Creating resource group ..." -NoNewline
(az group create --name $resourceGroup --location $location --output json) 2>> $logFile | Out-Null
Write-Host "Done." -ForegroundColor Green

# Deploy Azure services (deploys LUIS, QnA Maker, Content Moderator, CosmosDB)
if ($parametersFile) {
	Write-Host "> Validating Azure deployment ..." -NoNewline
	$validation = az deployment group validate `
		--resource-group $resourcegroup `
		--template-file "$(Join-Path $PSScriptRoot '..' 'Resources' 'template.json')" `
		--parameters "@$($parametersFile)" `
		--parameters name=$name `
        --output json

	if ($validation) {    
		$validation >> $logFile
		$validation = $validation | ConvertFrom-Json
	
		if (-not $validation.error) {
            Write-Host "Done." -ForegroundColor Green
			Write-Host "> Deploying Azure services (this could take a while)..." -ForegroundColor Yellow -NoNewline
			$deployment = az deployment group create `
				--name $timestamp `
				--resource-group $resourceGroup `
				--template-file "$(Join-Path $PSScriptRoot '..' 'Resources' 'template.json')" `
				--parameters "@$($parametersFile)" `
				--parameters name=$name `
                --output json 2>> $logFile | Out-Null

            Write-Host "Done." -ForegroundColor Green
			Write-Host "Deployment name: $($timestamp)"
		}
		else {
			Write-Host "! Template is not valid with provided parameters. Review the log for more information." -ForegroundColor Red
			Write-Host "! Error: $($validation.error.message)"  -ForegroundColor Red
			Write-Host "! Log: $($logFile)" -ForegroundColor Red
			Write-Host "+ To delete this resource group, run 'az group delete -g $($resourceGroup) --no-wait'" -ForegroundColor Magenta
			Break
		}
	}
}
else {
	Write-Host "> Validating Azure deployment ..." -NoNewline
	$validation = az deployment group validate `
		--resource-group $resourcegroup `
		--template-file "$(Join-Path $PSScriptRoot '..' 'Resources' 'template.json')" `
		--parameters name=$name `
        --output json

	if ($validation) {
		$validation >> $logFile
		$validation = $validation | ConvertFrom-Json

		if (-not $validation.error) {
            Write-Host "Done." -ForegroundColor Green
			Write-Host "> Deploying Azure services (this could take a while)..." -ForegroundColor Yellow -NoNewline
			$deployment = az deployment group create `
				--name $timestamp `
				--resource-group $resourceGroup `
				--template-file "$(Join-Path $PSScriptRoot '..' 'Resources' 'template.json')" `
				--parameters name=$name `
                --output json 2>> $logFile | Out-Null

            Write-Host "Done." -ForegroundColor Green
		}
		else {
			Write-Host "! Template is not valid with provided parameters. Review the log for more information." -ForegroundColor Red
			Write-Host "! Error: $($validation.error.message)"  -ForegroundColor Red
			Write-Host "! Log: $($logFile)" -ForegroundColor Red
			Write-Host "+ To delete this resource group, run 'az group delete -g $($resourceGroup) --no-wait'" -ForegroundColor Magenta
			Break
		}
	}
}

# Get deployment outputs
$outputs = (az deployment group show `
	--name $timestamp `
	--resource-group $resourceGroup `
	--query properties.outputs `
    --output json) 2>> $logFile

# If it succeeded then we perform the remainder of the steps
if ($outputs)
{
	# Log and convert to JSON
	$outputs >> $logFile
	$outputs = $outputs | ConvertFrom-Json
	$outputMap = @{}
	$outputs.PSObject.Properties | Foreach-Object { $outputMap[$_.Name] = $_.Value }

	# Update appsettings.json
	Write-Host "> Updating appsettings.json ..." -NoNewline
	if (Test-Path $(Join-Path $projDir appsettings.json)) {
		$settings = Get-Content -Encoding utf8 $(Join-Path $projDir appsettings.json) | ConvertFrom-Json
	}
	else {
		$settings = New-Object PSObject
	}

	$settings.AzureAd.ClientId = $appId
	
	$tenantId = (az account show --query tenantId --output json) | ConvertFrom-Json
	$settings.AzureAd.TenantId = $tenantId

	$settings.TableStorage = $outputMap["tableStorage"].value

	$settings | ConvertTo-Json -depth 100 | Out-File -Encoding utf8 $(Join-Path $projDir appsettings.json)
	
    Write-Host "Done." -ForegroundColor Green

	# Summary 
	Write-Host "+ Summary of the deployed resources:" -ForegroundColor Magenta
	Write-Host "    - Resource Group: $($resourceGroup)" -ForegroundColor Magenta
	Write-Host "    - Microsoft App Id: $($appId)" -ForegroundColor Magenta
	Write-Host "    - Microsoft App Password: $($appPassword)" -ForegroundColor Magenta

	Write-Host "> Deployment complete." -ForegroundColor Green
}
else
{
	# Check for failed deployments
	$operations = (az deployment group operation list -g $resourceGroup -n $timestamp --output json) 2>> $logFile | Out-Null 
	
	if ($operations) {
		$operations = $operations | ConvertFrom-Json
		$failedOperations = $operations | Where { $_.properties.statusmessage.error -ne $null }
		if ($failedOperations) {
			foreach ($operation in $failedOperations) {
				switch ($operation.properties.statusmessage.error.code) {
					"MissingRegistrationForLocation" {
						Write-Host "! Deployment failed for resource of type $($operation.properties.targetResource.resourceType). This resource is not avaliable in the location provided." -ForegroundColor Red
						Write-Host "+ Update the .\Deployment\Resources\parameters.template.json file with a valid region for this resource and provide the file path in the -parametersFile parameter." -ForegroundColor Magenta
					}
					default {
						Write-Host "! Deployment failed for resource of type $($operation.properties.targetResource.resourceType)."
						Write-Host "! Code: $($operation.properties.statusMessage.error.code)."
						Write-Host "! Message: $($operation.properties.statusMessage.error.message)."
					}
				}
			}
		}
	}
	else {
		Write-Host "! Deployment failed. Please refer to the log file for more information." -ForegroundColor Red
		Write-Host "! Log: $($logFile)" -ForegroundColor Red
	}
	
	Write-Host "+ To delete this resource group, run 'az group delete -g $($resourceGroup) --no-wait'" -ForegroundColor Magenta
	Break
}