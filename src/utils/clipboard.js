/**
 * Copy text to clipboard with fallback for unsupported browsers
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  // Modern clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed:', err);
      return fallbackCopy(text);
    }
  }

  // Fallback for older browsers
  return fallbackCopy(text);
};

/**
 * Fallback clipboard copy using textarea
 * @param {string} text - Text to copy
 * @returns {boolean} - Success status
 */
const fallbackCopy = (text) => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    textArea.remove();
    return success;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
};
