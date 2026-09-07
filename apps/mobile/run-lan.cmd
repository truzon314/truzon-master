@echo off
echo [Truzon] Starting Expo on Local Wi-Fi (LAN)...
echo [Truzon] Ensure your phone is connected to the SAME Wi-Fi network as this PC.
echo [Truzon] Your PC Wi-Fi IP is: 192.168.1.10
echo [Truzon] Scan the QR code using Expo Go (Android) or Camera app (iOS).
npx expo start --host lan -c
