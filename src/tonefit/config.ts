// ToneFit (new isolated flow) — backend connectivity config.
//
// Android emulator reaches the host Mac's localhost via the special IP 10.0.2.2.
// If you run on a physical device, set this to http://<MAC_LAN_IP>:8000 and
// start the backend with:  uvicorn main:app --host 0.0.0.0 --port 8000
//
// Note: cleartext HTTP is already allowed by AndroidManifest
// (android:usesCleartextTraffic="true"), so no native change is needed.
export const BASE_URL = 'http://10.0.2.2:8000';
