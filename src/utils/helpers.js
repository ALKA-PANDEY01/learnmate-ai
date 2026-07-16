/**
 * Utility helper to conditionally join CSS class names.
 * @param  {...string} classes - List of class names to merge.
 * @returns {string} - Merged class names string.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format date strings to readable local formats.
 * @param {string} dateString - ISO date string.
 * @returns {string} - Formatted date.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Limit string characters with ellipsis.
 * @param {string} str - Target string.
 * @param {number} num - Max character length.
 * @returns {string} - Truncated string.
 */
export function truncate(str, num) {
  if (!str) return '';
  if (str.length <= num) return str;
  return str.slice(0, num) + '...';
}
