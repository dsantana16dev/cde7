param(
  [string]$EnvFile = ".env",
  [string[]]$Files
)

$ErrorActionPreference = "Stop"

function Read-DotEnv {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Env file not found: $Path"
  }

  $values = @{}
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }

    $separator = $line.IndexOf("=")
    if ($separator -lt 1) { return }

    $key = $line.Substring(0, $separator).Trim()
    $value = $line.Substring($separator + 1).Trim()

    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    $values[$key] = $value
  }

  return $values
}

function Join-FtpUrl {
  param(
    [string]$BaseUrl,
    [string]$RelativePath
  )

  $normalized = $RelativePath.Replace("\", "/").TrimStart("/")
  $segments = $normalized.Split("/") | ForEach-Object { [uri]::EscapeDataString($_) }
  return $BaseUrl + ($segments -join "/")
}

$envValues = Read-DotEnv $EnvFile

$ftpHost = $envValues["FTP_HOST"]
$ftpUser = $envValues["FTP_USER"]
$ftpPass = $envValues["FTP_PASS"]
$remoteDir = $envValues["FTP_REMOTE_DIR"]
$fileList = $envValues["FTP_FILES"]

if (-not $ftpHost -or -not $ftpUser -or -not $ftpPass) {
  throw "FTP_HOST, FTP_USER and FTP_PASS are required in $EnvFile"
}

if (-not $remoteDir) { $remoteDir = "/" }
if (-not $remoteDir.StartsWith("/")) { $remoteDir = "/" + $remoteDir }
if (-not $remoteDir.EndsWith("/")) { $remoteDir = $remoteDir + "/" }

if ($Files -and $Files.Count) {
  $files = $Files
} elseif ($fileList) {
  $files = $fileList.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ }
} else {
  $files = @("index.html", "script.js", "styles.css")
}

$curl = Get-Command curl.exe -ErrorAction Stop
$baseUrl = "ftp://$ftpHost$remoteDir"

foreach ($file in $files) {
  if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
    throw "Local file not found: $file"
  }

  $remoteUrl = Join-FtpUrl $baseUrl $file
  & $curl.Source --fail --silent --show-error --ftp-pasv --user "$ftpUser`:$ftpPass" --upload-file $file $remoteUrl
  if ($LASTEXITCODE -ne 0) { throw "FTP upload failed for $file" }

  $verifyPath = Join-Path $env:TEMP ("cde7-ftp-" + [guid]::NewGuid().ToString("N") + "-" + (Split-Path -Leaf $file))
  & $curl.Source --fail --silent --show-error --ftp-pasv --user "$ftpUser`:$ftpPass" --output $verifyPath $remoteUrl
  if ($LASTEXITCODE -ne 0) { throw "FTP verification download failed for $file" }

  $localHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $file).Hash
  $remoteHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $verifyPath).Hash
  Remove-Item -LiteralPath $verifyPath -Force

  if ($localHash -ne $remoteHash) {
    throw "FTP verification hash mismatch for $file"
  }

  Write-Output "published $file"
}

Write-Output "FTP publish complete"
