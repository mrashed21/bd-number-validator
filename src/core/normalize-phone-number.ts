import { COUNTRY_CODE, detectOperator, LOCAL_NUMBER_LENGTH } from "./operators";

/**
 * Strip everything that is not an ASCII digit.
 *
 * @example
 * sanitizePhoneNumber("+880 17-8113 1905"); // "8801781131905"
 */
export function sanitizePhoneNumber(input: string): string {
  return typeof input === "string" ? input.replace(/[^0-9]/g, "") : "";
}

/**
 * Convert any accepted input shape into the local `0`-leading form.
 *
 * Handles `+880…`, `880…`, `80…`, `0…` and bare `1…` subscriber numbers.
 * The result is *not* validated — call {@link validatePhoneNumber} for that.
 *
 * @example
 * toLocalNumber("+8801781131905"); // "01781131905"
 * toLocalNumber("1781131905");     // "01781131905"
 */
export function toLocalNumber(input: string): string {
  const digits = sanitizePhoneNumber(input);
  if (!digits) return "";

  if (digits.startsWith("8801")) return digits.slice(2);
  if (digits.startsWith("880")) return "0" + digits.slice(3);
  if (digits.startsWith("801")) return digits.slice(1);
  if (digits.startsWith("80")) return "0" + digits.slice(2);
  if (digits.startsWith("0")) return digits;
  return "0" + digits;
}

/**
 * Digits to keep in a phone *input field*.
 *
 * Unlike {@link toLocalNumber} this is safe to run on every keystroke: it never
 * rewrites a partially typed number. A country code is only removed once the
 * value is longer than a local number can be, which is the point at which the
 * intent is unambiguous. The result is clamped to {@link LOCAL_NUMBER_LENGTH}.
 *
 * @example
 * toInputDigits("017");             // "017"        (typing, untouched)
 * toInputDigits("+8801781131905");  // "01781131905" (paste, country code removed)
 */
export function toInputDigits(input: string): string {
  let digits = sanitizePhoneNumber(input);

  if (digits.length > LOCAL_NUMBER_LENGTH) {
    // "00" international access code, e.g. 008801781131905
    if (digits.startsWith("00")) digits = digits.slice(2);
  }

  if (digits.length > LOCAL_NUMBER_LENGTH) {
    if (digits.startsWith("880")) digits = "0" + digits.slice(3);
    else if (digits.startsWith("80")) digits = "0" + digits.slice(2);
  }

  return digits.slice(0, LOCAL_NUMBER_LENGTH);
}

/**
 * Return the canonical `+8801XXXXXXXXX` form, or `undefined` when the input is
 * not a complete Bangladeshi mobile number.
 *
 * This is a thin convenience wrapper around {@link validatePhoneNumber} for
 * callers that only care about the normalized string.
 */
export function normalizePhoneNumber(input: string): string | undefined {
  const local = toLocalNumber(input);
  if (local.length !== LOCAL_NUMBER_LENGTH) return undefined;
  if (detectOperator(local) === "Unknown") return undefined;
  return COUNTRY_CODE + local.slice(1);
}
