/* Klien REST API terpusat: base URL dari env, token Bearer otomatis,
   timeout, validasi format respons, dan normalisasi error. */

/** VITE_API_URL boleh berupa alamat utama (http://host) atau lengkap dengan prefix (http://host/api). */
function resolveApiUrl(raw) {
  const value = String(raw || '').trim().replace(/\/+$/, '');
  if (!value) return '';
  try {
    return new URL(value).pathname === '/' ? `${value}/api` : value;
  } catch {
    return value;
  }
}

const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL);

if (!API_URL) {
  console.error('[api] VITE_API_URL belum diatur. Salin frontend/.env.example lalu jalankan ulang Vite.');
}

const API_ORIGIN = (() => {
  try { return new URL(API_URL).origin; } catch { return ''; }
})();

const DEFAULT_TIMEOUT = 15000;

const STATUS_MESSAGES = {
  400: 'Data yang dikirim belum valid.',
  401: 'Sesi Anda tidak valid atau telah berakhir. Silakan masuk kembali.',
  403: 'Anda tidak memiliki akses untuk tindakan ini.',
  404: 'Data yang diminta tidak ditemukan.',
  409: 'Data bentrok dengan data yang sudah ada.',
  413: 'Ukuran berkas terlalu besar.',
  429: 'Terlalu banyak permintaan. Coba lagi sebentar lagi.',
  500: 'Terjadi kesalahan pada server. Coba lagi nanti.',
  503: 'Layanan sedang tidak tersedia. Coba lagi nanti.'
};

export class ApiError extends Error {
  /** kind: 'http' | 'network' | 'timeout' | 'aborted' | 'invalid_response' */
  constructor(message, { status = 0, kind = 'http', detail = '', body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.kind = kind;
    this.detail = detail;
    this.body = body;
  }
}

export function invalidResponse(detail = '') {
  return new ApiError('Respons server tidak sesuai format yang diharapkan.', { kind: 'invalid_response', detail });
}

/** Ubah path relatif dari backend (mis. /storage/news/x.jpg) menjadi URL absolut. */
export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

let getToken = () => null;
let onUnauthorized = () => {};

/** Dipanggil sekali oleh AuthProvider agar token tidak perlu ditulis di tiap komponen. */
export function configureAuth(handlers) {
  getToken = handlers.getToken || getToken;
  onUnauthorized = handlers.onUnauthorized || onUnauthorized;
}

function buildUrl(path, query) {
  const url = `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request(path, { method = 'GET', query, body, signal, timeout = DEFAULT_TIMEOUT, headers = {} } = {}) {
  const finalHeaders = { Accept: 'application/json', ...headers };
  let payload;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const token = getToken();
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeout);
  const forwardAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', forwardAbort, { once: true });
  }

  let res;
  try {
    res = await fetch(buildUrl(path, query), { method, headers: finalHeaders, body: payload, signal: controller.signal });
  } catch {
    if (timedOut) throw new ApiError('Server terlalu lama merespons. Coba lagi.', { kind: 'timeout' });
    if (signal?.aborted) throw new ApiError('Permintaan dibatalkan.', { kind: 'aborted' });
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet atau pastikan backend sedang berjalan.', { kind: 'network' });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }

  let json = null;
  const text = await res.text().catch(() => '');
  if (text) {
    try { json = JSON.parse(text); } catch { json = null; }
  }

  if (!res.ok) {
    if (res.status === 401 && token) onUnauthorized();
    const detail = (json && (json.error || json.message)) || '';
    const message = STATUS_MESSAGES[res.status] || (res.status >= 500 ? STATUS_MESSAGES[500] : 'Permintaan gagal diproses.');
    throw new ApiError(message, { status: res.status, kind: 'http', detail, body: json });
  }

  if (!json || typeof json !== 'object' || json.success === false) {
    throw invalidResponse(`HTTP ${res.status}`);
  }

  return { data: json.data ?? null, meta: json.meta ?? null, message: json.message || '' };
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' })
};

/** Pesan error siap tampil: pesan ramah + detail dari server bila ada. */
export function errorMessage(err) {
  if (!err) return '';
  if (err instanceof ApiError) return err.detail && err.kind === 'http' && err.status < 500 ? `${err.message} (${err.detail})` : err.message;
  return 'Terjadi kesalahan tak terduga.';
}
