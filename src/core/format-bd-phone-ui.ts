import { sanitizePhoneNumber } from "./normalize-phone-number";

/**
 * Group digits for display as `017 8113 1905` (3 / 4 / 4).
 *
 * Presentation only — the value you store and submit stays digits-only.
 * Safe to call on a partially typed number.
 *
 * @example
 * formatBdPhoneUi("017");         // "017"
 * formatBdPhoneUi("0178113");     // "017 8113"
 * formatBdPhoneUi("01781131905"); // "017 8113 1905"
 */
export function formatBdPhoneUi(input: string): string {
  const digits = sanitizePhoneNumber(input);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}
