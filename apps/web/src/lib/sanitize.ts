const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const SCRIPT_TAG = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER = /\son\w+\s*=\s*["'][^"']*["']/gi;
const JS_URL = /\s*href\s*=\s*["']\s*javascript\s*:/gi;

export function sanitizeText(value: string, maxLength = 2000): string {
  if (typeof value !== 'string') return '';
  let sanitized = value.trim();
  sanitized = sanitized.replace(CONTROL_CHARS, '');
  sanitized = sanitized.replace(SCRIPT_TAG, '');
  sanitized = sanitized.replace(EVENT_HANDLER, '');
  sanitized = sanitized.replace(JS_URL, '');
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}

export function sanitizeName(value: string, maxLength = 50): string {
  if (typeof value !== 'string') return '';
  let sanitized = value.trim();
  sanitized = sanitized.replace(CONTROL_CHARS, '');
  sanitized = sanitized.replace(SCRIPT_TAG, '');
  sanitized = sanitized.replace(EVENT_HANDLER, '');
  sanitized = sanitized.replace(JS_URL, '');
  sanitized = sanitized.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]/g, '');
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}

export function sanitizeFileName(name: string): string {
  if (typeof name !== 'string') return 'file';
  return name
    .replace(/\.\.\//g, '')
    .replace(/\.\./g, '')
    .replace(/\0/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 200);
}

export function sanitizeEmail(value: string): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

export function sanitizePhone(value: string): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function sanitizeIdNumber(value: string): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s/g, '');
}

export function sanitizeForDb(value: string): string {
  if (typeof value !== 'string') return '';
  return value;
}
