// ToneFit API client (isolated, dependency-free).
//
// Uses the built-in fetch (no CORS for native) and the local MMKV token store.
// Every protected call attaches `Authorization: Bearer <token>` automatically.
//
// Backend contract: see the flow spec. Base URL comes from ./config.
import { BASE_URL } from './config';
import { tokenStore } from './tokenStore';

export type PickedFile = {
  /** Local file uri from the image picker (e.g. file:///...). */
  uri: string;
  /** Multipart filename; defaults to photo.jpg. */
  name?: string;
  /** Mime type; defaults to image/jpeg. */
  type?: string;
};

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const parseBody = async (res: Response): Promise<any> => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const authHeader = (): Record<string, string> => {
  const t = tokenStore.get();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// ---- JSON requests --------------------------------------------------------

const jsonRequest = async (
  path: string,
  method: 'GET' | 'POST',
  body?: Record<string, any> | null,
  auth = false,
): Promise<any> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) Object.assign(headers, authHeader());

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const data = await parseBody(res);
  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) || `Request failed (${res.status}).`;
    throw new ApiError(typeof msg === 'string' ? msg : 'Request failed.', res.status, data);
  }
  return data;
};

// ---- Multipart (image upload) ---------------------------------------------

const multipart = async (
  path: string,
  fieldName: string,
  file: PickedFile,
  auth = true,
): Promise<any> => {
  const form = new FormData();
  form.append(fieldName, {
    uri: file.uri,
    name: file.name ?? 'photo.jpg',
    type: file.type ?? 'image/jpeg',
  } as any);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    // NOTE: do NOT set Content-Type manually — fetch adds the multipart boundary.
    headers: auth ? authHeader() : {},
    body: form,
  });
  const data = await parseBody(res);
  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) || `Upload failed (${res.status}).`;
    throw new ApiError(typeof msg === 'string' ? msg : 'Upload failed.', res.status, data);
  }
  return data;
};

// ---- Public flow endpoints ------------------------------------------------

export type RegisterBody = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
};

export const register = (body: RegisterBody) =>
  jsonRequest('/register', 'POST', body, false);

export const verifyOtp = (phone_number: string, otp_code: string) =>
  jsonRequest('/verify-otp', 'POST', { phone_number, otp_code }, false);

export const resendOtp = (phone_number: string) =>
  jsonRequest('/resend-otp', 'POST', { phone_number }, false);

/** Logs in and persists the JWT. Returns the raw { access_token, token_type }. */
export const login = async (email: string, password: string) => {
  const data = await jsonRequest('/login', 'POST', { email, password }, false);
  if (data?.access_token) tokenStore.set(data.access_token);
  return data;
};

// ---- Protected flow endpoints ---------------------------------------------

/** Skin-tone analysis — multipart field MUST be "file". Required before recs. */
export const analyzeSkinTone = (file: PickedFile) =>
  multipart('/skintone/analyze', 'file', file, true);

/** Optional: also save the same image as the profile picture (field "file"). */
export const uploadProfileImage = (file: PickedFile) =>
  multipart('/profile/upload-image', 'file', file, true);

export const getRecommendations = (category: string) =>
  jsonRequest(
    `/skintone/recommendations?category=${encodeURIComponent(category)}`,
    'GET',
    null,
    true,
  );

/** Try-on capture — query product_id, multipart field MUST be "image_file". */
export const capture = (productId: number | string, file: PickedFile) =>
  multipart(
    `/tryon/capture?product_id=${encodeURIComponent(String(productId))}`,
    'image_file',
    file,
    true,
  );

/**
 * Image source for the rendered try-on result. The endpoint returns image/jpeg
 * and requires the Bearer token, so we pass it as a header on the source.
 *   <Image source={resultImageSource(id)} />
 */
export const resultImageSource = (id: number | string) => ({
  uri: `${BASE_URL}/tryon/result/${id}`,
  headers: authHeader(),
});

export { tokenStore };
