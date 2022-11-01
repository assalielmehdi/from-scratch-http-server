export const SEPARATOR_CHARS: string[] = ['(', ')', '<', '>', '@', ',', ';', ':', '\\', '"', '/', '[', ']', '?', '=', '{', '}', ' ', '\t'];

export const CTL_CHARS: string[] = [...Array(32).keys(), 127].map(charCode => String.fromCharCode(charCode));

const assertHasLength = (value: string, length: number): void => {
  if (value.length != length) {
    throw new Error(`${value} should have length ${length}.`);
  }
};

/**
 * Checks if a given character is a ctl character as defined in https://www.rfc-editor.org/rfc/rfc2616#section-2.2.
 */
export const isCTL = (value: string): boolean => {
  assertHasLength(value, 1);

  return CTL_CHARS.includes(value);
};

/**
 * Checks if a given character is a separator as defined in https://www.rfc-editor.org/rfc/rfc2616#section-2.2.
 */
export const isSeparator = (value: string): boolean => {
  assertHasLength(value, 1);

  return SEPARATOR_CHARS.includes(value);
};

/**
 * Checks if a given string is a token as defined in https://www.rfc-editor.org/rfc/rfc2616#section-2.2.
 */
export const isToken = (value: string): boolean => {
  if (value.length === 0) {
    return false;
  }

  return value.split('').every(char => !isCTL(char) && !isSeparator(char));
};
