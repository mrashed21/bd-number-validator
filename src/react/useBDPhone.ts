import { useState } from "react";
import { validatePhoneNumber } from "../validate";

export function useBDPhone(initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = (v: string) => {
    const cleaned = v.replace(/[^0-9]/g, "");
    setValue(cleaned);
  };

  const validation = validatePhoneNumber(value);

  return {
    raw: value,
    normalized: validation.normalized,
    operator: validation.operator,
    error: validation.error,
    isValid: validation.isValid,
    onChange,
  };
}
