import React from "react";
import "./bd-phone.css";
import FLAG from "./flag.svg";
import { useBDPhone } from "./useBDPhone";
const BD_FLAG = FLAG;
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

      <div className={`${inputBoxClass} ${!isValid ? "bdp-error-border" : ""}`}>
        <img src={BD_FLAG} className="bdp-flag" />
        <span className="bdp-prefix">+880</span>

        <input
          className={inputClass}
          placeholder="1XXXXXXXXX"
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
