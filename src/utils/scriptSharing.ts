// DATA LAYER: Script sharing utilities with Base64 encoding

export interface SharedScriptData {
  title: string;
  content: string;
  version: number;
}

const SHARE_VERSION = 1;
const URL_PARAM = 'script';

/**
 * Encode a script to a Base64 string for URL sharing
 */
export function encodeScript(title: string, content: string): string {
  const data: SharedScriptData = {
    title,
    content,
    version: SHARE_VERSION
  };
  
  const jsonString = JSON.stringify(data);
  // Use encodeURIComponent to handle Unicode characters properly
  const base64 = btoa(encodeURIComponent(jsonString));
  return base64;
}

/**
 * Decode a Base64 string back to script data
 */
export function decodeScript(encoded: string): SharedScriptData | null {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const data = JSON.parse(jsonString) as SharedScriptData;
    
    // Validate structure
    if (!data.title || !data.content) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * Generate a shareable URL for a script
 */
export function generateShareUrl(title: string, content: string): string {
  const encoded = encodeScript(title, content);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?${URL_PARAM}=${encoded}`;
}

/**
 * Check if the current URL contains a shared script
 */
export function getSharedScriptFromUrl(): SharedScriptData | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get(URL_PARAM);
  
  if (!encoded) {
    return null;
  }
  
  return decodeScript(encoded);
}

/**
 * Clear the script parameter from URL without reload
 */
export function clearScriptFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(URL_PARAM);
  window.history.replaceState({}, '', url.toString());
}
