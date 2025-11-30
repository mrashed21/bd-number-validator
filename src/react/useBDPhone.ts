// import { useState } from "react";
// import { validatePhoneNumber } from "../validate";

// export function useBDPhone(initial = "") {
//   const [value, setValue] = useState(initial);

//   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const input = e.target.value;
//     const digits = input.replace(/\D/g, "");

//     setValue(digits);
//   };

//   const validation = validatePhoneNumber(value);

//   return {
//     raw: value,
//     normalized: validation.normalized,
//     operator: validation.operator,
//     error: validation.error,
//     isValid: validation.isValid,
//     onChange,
//   };
// }

import { useState } from "react";
import { validatePhoneNumber } from "../validate";

export function useBDPhone(initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = (v: string) => {
    const cleaned = v.replace(/[^0-9]/g, ""); // raw only digits
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
