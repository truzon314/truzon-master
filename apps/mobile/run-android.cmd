@echo off
set ADB="%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"
if exist %ADB% (
  echo [Truzon] Configuring ADB reverse port forwarding...
  for /f "tokens=1" %%d in ('%ADB% devices ^| findstr /r /c:"[a-zA-Z0-9]	device"') do (
    echo [Truzon] Forwarding ports 8081 and 3000 to device %%d...
    %ADB% -s %%d reverse tcp:8081 tcp:8081
    %ADB% -s %%d reverse tcp:3000 tcp:3000
  )
)
echo [Truzon] Starting Expo in localhost mode with clear cache...
pnpm expo start --localhost -c
