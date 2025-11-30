type Operator =
  | "Grameenphone"
  | "Banglalink"
  | "Robi"
  | "Airtel"
  | "Teletalk"
  | "Unknown";

interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  operator?: Operator;
  error?: string;
}

export function validatePhoneNumber(input: string): PhoneValidationResult {
  if (!input || input.trim() === "") {
    return { isValid: true };
  }

  let value = input.replace(/[^0-9]/g, "");

  let raw = "";

  if (value.startsWith("8801")) {
    raw = value.slice(2);
  } else if (value.startsWith("880")) {
    raw = "0" + value.slice(3);
  } else if (value.startsWith("801")) {
    raw = value.slice(1);
  } else if (value.startsWith("80")) {
    raw = "0" + value.slice(2);
  } else if (value.startsWith("0")) {
    raw = value;
  } else {
    raw = "0" + value;
  }

  const operators: Record<string, string[]> = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"],
  };

  let operator: Operator = "Unknown";

  if (raw.length >= 3) {
    const prefix = raw.slice(0, 3);

    for (const [name, prefixList] of Object.entries(operators)) {
      if (prefixList.includes(prefix)) {
        operator = name as Operator;

        break;
      }
    }

    if (operator === "Unknown") {
      return { isValid: false, error: "Invalid operator" };
    }
  }

  if (raw.length < 3) {
    return { isValid: true };
  }
  if (raw.length === 3) {
    return { isValid: true, operator };
  }
  if (raw.length > 3 && raw.length < 11) {
    return { isValid: false, error: "Invalid number"};
  }

  if (raw.length > 11) {
    return { isValid: false, error: "Invalid number" };
  }
  if (raw.length === 11) {
    const normalized = "+880" + raw.slice(1);
    return {
      isValid: true,
      operator,
      normalized,
    };
  }

  return { isValid: false, error: "Invalid number" };
}
