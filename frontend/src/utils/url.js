/**
 * Normalizes a URL by trimming spaces, adding https:// if missing,
 * and handling common input errors.
 * @param {string} url - The raw URL input.
 * @returns {string} - The normalized URL or an empty string if invalid.
 */
export const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  let normalized = url.trim();
  if (!normalized) return '';

  // If it's already a full URL, just return it
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  // If it contains spaces, it's likely not a single URL/handle
  if (/\s/.test(normalized)) {
    return '';
  }

  // Handle inputs like "github.com/user" or "www.site.com"
  // Must contain at least one dot and no spaces
  if (/^www\./i.test(normalized) || (normalized.includes('.') && normalized.length > 3)) {
    return `https://${normalized}`;
  }

  return normalized;
};

/**
 * Validates if the input is a potentially valid URL or handle.
 * @param {string} url 
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  const normalized = normalizeUrl(url);
  try {
    new URL(normalized);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Formats a URL for display by removing the protocol and www.
 * @param {string} url 
 * @returns {string}
 */
export const formatDisplayUrl = (url) => {
  if (!url) return '';
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, ''); // Remove trailing slash
};
