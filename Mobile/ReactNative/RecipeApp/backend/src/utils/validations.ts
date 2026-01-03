/**
 * Checks if all string properties in an object are alphanumeric.
 * @param {Object} body - The request body to validate.
 * @param {Array} keysToValidate - Optional list of specific keys to check.
 * @returns {Object} - { isValid: boolean, invalidKey: string | undefined }
 */
export const validateAlphanumeric = (
  body: Record<string, unknown>,
  keysToValidate: string[] = []
): { isValid: boolean; invalidKey: string | undefined } => {
  // Regex: start of string, one or more alpha/numeric chars, end of string
  const alphaNumericRegex = /^[a-z0-9 ]+$/i;

  // Determine which keys to check (all if none specified)
  const keys = keysToValidate.length > 0 ? keysToValidate : Object.keys(body);

  for (const key of keys) {
    const value = body[key]?.toString();

    if (!value || !alphaNumericRegex.test(value)) {
      return { isValid: false, invalidKey: key };
    }
  }

  return { isValid: true, invalidKey: undefined };
};
