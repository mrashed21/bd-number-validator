import { sanitizePhoneNumber } from "./normalize-phone-number";

export function formatBdPhoneUi(input: string): string {
  const digits = sanitizePhoneNumber(input);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}
