// import React, { useRef } from "react";
// import "./bd-phone.css";
// import { formatBDPhoneUI } from "./formatBDPhoneUI";
// import { useBDPhone } from "./useBDPhone";
// interface BDPhoneInputProps {
//   value?: string;
//   onValueChange?: (v?: string) => void;
//   showError?: boolean;
//   customError?: (err: string) => React.ReactNode;
//   label?: string;
//   className?: string;
//   wrapperClass?: string;
//   inputBoxClass?: string;
//   inputClass?: string;
//   labelClass?: string;
// }

// export function BDPhoneInput({
//   value,
//   onValueChange,
//   showError = true,
//   customError,
//   label = "",
//   className = "",
//   wrapperClass = "bdp-wrapper",
//   inputBoxClass = "bdp-input-box",
//   inputClass = "bdp-input",
//   labelClass = "bdp-label",
// }: BDPhoneInputProps) {

//   const inputRef = useRef<HTMLInputElement>(null);
//   const { raw, onChange, error, isValid, normalized } = useBDPhone(value ?? "");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const cursor = e.target.selectionStart ?? 0;
//     const before = formatBDPhoneUI(raw);
//     onChange(e);
//     const after = formatBDPhoneUI(e.target.value.replace(/\D/g, ""));
//     requestAnimationFrame(() => {
//       const input = inputRef.current;
//       if (!input) return;

//       const diff = after.length - before.length;
//       input.selectionStart = input.selectionEnd = cursor + diff;
//     });
//   };

//   React.useEffect(() => {
//     onValueChange?.(isValid ? normalized : undefined);
//   }, [raw, isValid]);

//   return (
//     <div className={`${wrapperClass} ${className}`}>
//       <label className={labelClass}>{label}</label>

//       <div
//         className={`${inputBoxClass} ${
//           !isValid && raw ? "bdp-error-border" : ""
//         }`}
//       >
//         <div className="bdp-flag">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
//             <rect width="30" height="20" fill="#006a4e" />
//             <circle cx="12.5" cy="10" r="5" fill="#f42a41" />
//           </svg>
//         </div>
//         <span className="bdp-prefix">+880</span>

//         <input
//           ref={inputRef}
//           className={inputClass}
//           placeholder="enter phone number"
//           value={formatBDPhoneUI(raw)}
//           onChange={handleChange}
//         />
//       </div>

//       {showError &&
//         error &&
//         (customError ? (
//           customError(error)
//         ) : (
//           <span className="bdp-error-text">{error}</span>
//         ))}
//     </div>
//   );
// }

import React from "react";
import "./bd-phone.css";
import { formatBDPhoneUI } from "./formatBDPhoneUI";
import { useBDPhone } from "./useBDPhone";

interface BDPhoneInputProps {
  value?: string;
  onValueChange?: (v?: string) => void;
  showError?: boolean;
  customError?: (err: string) => React.ReactNode;
  label?: string;
  className?: string;
  wrapperClass?: string;
  inputBoxClass?: string;
  inputClass?: string;
  labelClass?: string;
}

export function BDPhoneInput({
  value,
  onValueChange,
  showError = true,
  customError,
  label = "",
  className = "",
  wrapperClass = "bdp-wrapper",
  inputBoxClass = "bdp-input-box",
  inputClass = "bdp-input",
  labelClass = "bdp-label",
}: BDPhoneInputProps) {
  const { raw, onChange, error, isValid, normalized } = useBDPhone(value ?? "");
  console.log("error: ", error);
  console.log("raw: ", raw);
  console.log("onChange: ", onChange);
  console.log("isValid: ", isValid);
  console.log("normalized: ", normalized);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // 🔥 Handle Change (Cursor Stable)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursor = e.target.selectionStart ?? 0;

    const before = formatBDPhoneUI(raw);
    const newDigits = e.target.value.replace(/\D/g, "");

    onChange(newDigits);

    const after = formatBDPhoneUI(newDigits);

    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;

      const diff = after.length - before.length;
      input.selectionStart = input.selectionEnd = cursor + diff;
    });
  };

  React.useEffect(() => {
    onValueChange?.(isValid ? normalized : undefined);
  }, [raw, isValid]);

  return (
    <div className={`${wrapperClass} ${className}`}>
      {label && <label className={labelClass}>{label}</label>}

      <div
        className={`${inputBoxClass} ${
          !isValid && raw ? "bdp-error-border" : ""
        }`}
      >
        <div className="bdp-flag">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
            <rect width="30" height="20" fill="#006a4e" />
            <circle cx="12.5" cy="10" r="5" fill="#f42a41" />
          </svg>
        </div>
        <span className="bdp-prefix">+880</span>

        <input
          ref={inputRef}
          className={inputClass}
          placeholder="enter phone number"
          value={formatBDPhoneUI(raw)}
          onChange={handleChange}
        />
      </div>

      {showError &&
        raw.length >= 3 &&
        error &&
        (customError ? (
          customError(error)
        ) : (
          <span className="bdp-error-text">{error}</span>
        ))}
    </div>
  );
}
