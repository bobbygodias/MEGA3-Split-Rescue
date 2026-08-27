# OpenPGP Enterprise for Android

Minimal offline Android wrapper around OpenPGP.js 6.3.1, designed for the Blackview MEGA 3 (Android 15) and modern Android System WebView.

## Security model
- OpenPGP.js is pinned to 6.3.1 at build time.
- No CDN or network dependency at runtime.
- No `INTERNET` permission, Google Play Services, Firebase, analytics, telemetry, cloud sync or ads.
- Local assets are exposed only through AndroidX `WebViewAssetLoader` under the reserved HTTPS origin `https://appassets.androidplatform.net/`, so WebCrypto has a secure context.
- CSP blocks external scripts and network connections.
- `file://` and content access are disabled.
- Private keys are not persisted automatically.
- WebView debugging is disabled.

## Functions in v1
- Runtime compatibility diagnosis.
- Curve25519 ECC key generation.
- Text encryption/decryption.
- Cleartext signing/verification.

## Upstream
OpenPGP.js: https://github.com/openpgpjs/openpgpjs
License: LGPL-3.0-or-later. This project does not modify OpenPGP.js; the pinned upstream browser bundle is included in the APK at build time.

## Wrapper license
The Android wrapper code is released under the MIT License. OpenPGP.js remains LGPL-3.0-or-later under its upstream terms.
