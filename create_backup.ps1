$source = "c:\Users\abhishekh\Desktop\RASSA boutique\rassa-elegance-weaver-main"
$temp = "c:\Users\abhishekh\Desktop\Rassa_Temp_Backup"
$zipPath = "c:\Users\abhishekh\Desktop\RASSA_Boutique_Backup.zip"

if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

New-Item -ItemType Directory -Path $temp | Out-Null

robocopy $source $temp /E /XD node_modules .git .output .nitro dist | Out-Null

Compress-Archive -Path "$temp\*" -DestinationPath $zipPath

Remove-Item $temp -Recurse -Force

Write-Host "Zip created successfully at $zipPath"
