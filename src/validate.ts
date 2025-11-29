export type Operator =
  | "Grameenphone"
  | "Banglalink"
  | "Robi"
  | "Airtel"
  | "Teletalk"
  | "Unknown";

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  operator?: Operator;
  error?: string;
}

export function validatePhoneNumber(input: string): PhoneValidationResult {
  if (!input || input.trim() === "") {
    return { isValid: true };
  }

  let raw = input.replace(/[^0-9]/g, "");

  if (raw.length < 10) {
    return { isValid: true };
  }

  if (raw.length === 10 && raw.startsWith("1")) {
    raw = "0" + raw;
  }

  if (raw.startsWith("880") && raw.length === 13) {
    raw = "0" + raw.slice(3);
  }

  if (!(raw.length === 11 && raw.startsWith("01"))) {
    return { isValid: false, error: "Invalid number format" };
  }

  const prefix = raw.slice(0, 3);

  const operators: Record<Operator, string[]> = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"],
    Unknown: [],
  };

  let operator: Operator = "Unknown";
  for (const [op, arr] of Object.entries(operators)) {
    if (arr.includes(prefix)) operator = op as Operator;
  }

  if (operator === "Unknown") {
    return { isValid: false, error: "Invalid operator prefix" };
  }

  return {
    isValid: true,
    normalized: "+880" + raw.slice(1),
    operator,
  };
}
