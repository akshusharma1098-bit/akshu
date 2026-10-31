# Aura Studio - Local Static Web Server
param(
    [int]$Port = 8080
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  AURA STUDIO LOCAL WEB SERVER IS ACTIVE AND RUNNING!    " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  URL: $prefix" -ForegroundColor Yellow
    Write-Host "  Folder: $(Get-Location)" -ForegroundColor Gray
    Write-Host "  Press Ctrl + C in this terminal window to STOP the server." -ForegroundColor DarkGray
    Write-Host "==========================================================" -ForegroundColor Green

    $mimeTypes = @{
        ".html"  = "text/html; charset=utf-8"
        ".htm"   = "text/html; charset=utf-8"
        ".css"   = "text/css; charset=utf-8"
        ".js"    = "application/javascript; charset=utf-8"
        ".json"  = "application/json; charset=utf-8"
        ".svg"   = "image/svg+xml"
        ".png"   = "image/png"
        ".jpg"   = "image/jpeg"
        ".jpeg"  = "image/jpeg"
        ".ico"   = "image/x-icon"
        ".woff2" = "font/woff2"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath) -or $relPath -eq "/") {
            $relPath = "index.html"
        }

        # Resolve path safely inside current directory
        $safePath = Join-Path (Get-Location) $relPath

        if (Test-Path $safePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($safePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($safePath)

            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.Close()
    }
}
catch {
    Write-Error $_
}
finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
