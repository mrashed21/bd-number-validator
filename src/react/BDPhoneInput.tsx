import React from "react";
import "./bd-phone.css";
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

  React.useEffect(() => {
    onValueChange?.(isValid ? normalized : undefined);
  }, [raw, isValid]);

  return (
    <div className={`${wrapperClass} ${className}`}>
      <label className={labelClass}>{label}</label>

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
          className={inputClass}
          placeholder="enter phone number"
          value={raw}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {showError &&
        error &&
        (customError ? (
          customError(error)
        ) : (
          <span className="bdp-error-text">{error}</span>
        ))}
    </div>
  );
}
