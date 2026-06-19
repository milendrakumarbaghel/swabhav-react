/**
 * Returns true if the given string is a valid email address.
 */
export const isEmailValid = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Returns true if the given string is non-empty after trimming.
 */
export const isRequired = (value) => value.trim().length > 0;
