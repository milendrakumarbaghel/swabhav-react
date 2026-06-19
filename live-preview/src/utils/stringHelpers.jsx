/**
 * Returns up to 2 uppercase initials from a full name string.
 * E.g. "Aanya Sharma" → "AS"
 */
export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/**
 * Truncates a string to maxLen characters and appends "..." if longer.
 */
export const truncate = (str, maxLen) =>
  str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
