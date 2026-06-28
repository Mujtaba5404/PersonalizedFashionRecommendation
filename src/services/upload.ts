import ReactNativeBlobUtil from 'react-native-blob-util';
import { hideLoader, showLoader } from '../redux/slice/screenSlice';
import { store } from '../redux/store';
import { BASE_URL } from './index';

/**
 * Reliable multipart/form-data file upload for RN 0.83 (New Architecture).
 *
 * RN's built-in fetch/axios FormData uploads fail instantly ("Network Error")
 * when the file lives on Android scoped storage. We sidestep that entirely by
 * passing the image as base64 (captured via image-crop-picker `includeBase64`)
 * straight to react-native-blob-util, which builds the multipart body and does
 * the HTTP request natively.
 */

type UploadField = {
  /** Multipart field name the backend expects, e.g. `file` / `image_file`. */
  name: string;
  /** Base64-encoded file contents (NO `data:` prefix). */
  base64: string;
  /** Mime type, e.g. `image/jpeg`. */
  mime?: string;
  /** File name sent in the Content-Disposition header. */
  filename?: string;
};

export interface UploadResult<T = any> {
  error: string | null;
  data: T | null;
  status: number | null;
}

/**
 * @param endPoint  Path relative to BASE_URL, e.g. `skintone/analyze`.
 * @param field     The file field to upload.
 * @param query     Optional query params appended to the URL.
 * @param authToken Optional Bearer token. Pass this when the caller just
 *                  obtained a token (e.g. via ensureAuthToken) to avoid
 *                  depending on the Redux store being updated in time.
 */
export const uploadFile = async <T = any>(
  endPoint: string,
  field: UploadField,
  query: Record<string, string | number> = {},
  authToken?: string | null,
): Promise<UploadResult<T>> => {
  const token = authToken ?? store.getState()?.role?.userAuthToken;
  const lang = store.getState()?.role?.languageSelect ?? 'en';

  const qs = Object.keys(query).length
    ? '?' +
      Object.entries(query)
        .map(
          ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
        )
        .join('&')
    : '';

  const url = `${BASE_URL}/${endPoint.replace(/^\//, '')}${qs}`;

  const headers: Record<string, string> = { 'x-app-language': lang };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[uploadFile] POST ${url} | token: ${token ? '✅ present' : '❌ MISSING'}`);

  store.dispatch(showLoader('loading'));
  try {
    const res = await ReactNativeBlobUtil.config({ timeout: 60000 }).fetch(
      'POST',
      url,
      headers,
      [
        {
          name: field.name,
          filename: field.filename ?? 'photo.jpg',
          type: field.mime ?? 'image/jpeg',
          data: field.base64,
        },
      ],
    );

    const status = res.info().status;
    const raw = res.data;

    let parsed: any = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = raw;
    }

    if (status >= 200 && status < 300) {
      return { error: null, data: parsed, status };
    }

    const message =
      (parsed && (parsed.detail || parsed.message)) ||
      `Upload failed (${status}).`;
    return {
      error: typeof message === 'string' ? message : 'Upload failed.',
      data: parsed,
      status,
    };
  } catch (e: any) {
    return {
      error: e?.message || 'Something went wrong. Please try again.',
      data: null,
      status: null,
    };
  } finally {
    store.dispatch(hideLoader('idle'));
  }
};
