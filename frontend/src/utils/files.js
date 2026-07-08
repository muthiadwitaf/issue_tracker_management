const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export function fileUrl(filename) {
  return `${ORIGIN}/uploads/${filename}`;
}

export function isImage(mimeType) {
  return typeof mimeType === 'string' && mimeType.startsWith('image/');
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${exponent === 0 ? size : size.toFixed(1)} ${units[exponent]}`;
}
