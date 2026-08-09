import { COUNTRY_CODE, detectOperator, LOCAL_NUMBER_LENGTH } from "./operators";

export function sanitizePhoneNumber(input: string): string {
  return typeof input === "string" ? input.replace(/[^0-9]/g, "") : "";
}

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

export function toInputDigits(input: string): string {
  let digits = sanitizePhoneNumber(input);

  if (digits.length > LOCAL_NUMBER_LENGTH) {
    if (digits.startsWith("00")) digits = digits.slice(2);
  }

  if (digits.length > LOCAL_NUMBER_LENGTH) {
    if (digits.startsWith("880")) digits = "0" + digits.slice(3);
    else if (digits.startsWith("80")) digits = "0" + digits.slice(2);
  }

  return digits.slice(0, LOCAL_NUMBER_LENGTH);
}

export function normalizePhoneNumber(input: string): string | undefined {
  const local = toLocalNumber(input);
  if (local.length !== LOCAL_NUMBER_LENGTH) return undefined;
  if (detectOperator(local) === "Unknown") return undefined;
  return COUNTRY_CODE + local.slice(1);
}
