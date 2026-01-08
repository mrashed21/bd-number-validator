import { ReactNode, useEffect, useRef } from "react";
import { formatBDPhoneUI } from "./formatBDPhoneUI";
import { useBDPhone } from "./useBDPhone";

interface BDPhoneInputProps {
  value?: string;
  onValueChange?: (v?: string) => void;
  showError?: boolean;

  label?: string;
  showLabel?: boolean;
  labelClass?: string;
  renderLabel?: (label: string) => ReactNode;

  containerClass?: string;
  wrapperClass?: string;
  flagClass?: string;
  prefixClass?: string;
  inputClass?: string;
  errorClass?: string;

  renderFlag?: () => ReactNode;
  renderPrefix?: () => ReactNode;
  renderError?: (error: string) => ReactNode;
}

export function BDPhoneInput({
  value,
  onValueChange,
  showError = true,

  label = "Phone Number",
  showLabel = true,
  labelClass = "bdp-label",
  renderLabel,

  containerClass = "bdp-wrapper",
  wrapperClass = "bdp-input-box",
  flagClass = "bdp-flag",
  prefixClass = "bdp-prefix",
  inputClass = "bdp-input",
  errorClass = "bdp-error-text",

  renderFlag,
  renderPrefix,
  renderError,
}: BDPhoneInputProps) {
  const { raw, onChange, error, isValid, normalized } = useBDPhone(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const newValue = e.target.value;
    const newDigits = newValue.replace(/\D/g, "");

    let maxLength;

    if (newDigits.startsWith("8801")) maxLength = 15;
    else if (newDigits.startsWith("880")) maxLength = 15;
    else if (newDigits.startsWith("801")) maxLength = 15;
    else if (newDigits.startsWith("80")) maxLength = 15;
    else if (newDigits.startsWith("0")) maxLength = 11;
    else maxLength = 10;

    const limitedDigits = newDigits.slice(0, maxLength);

    let digitsBeforeCursor = 0;
    for (let i = 0; i < cursorPos && i < newValue.length; i++) {
      if (/\d/.test(newValue[i])) digitsBeforeCursor++;
    }

    onChange(limitedDigits);

    const newFormatted = formatBDPhoneUI(limitedDigits);
    let newCursorPos = 0;
    let digitCount = 0;

    for (let i = 0; i < newFormatted.length; i++) {
      if (/\d/.test(newFormatted[i])) {
        digitCount++;
        if (digitCount >= digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }
    }

    if (digitCount < digitsBeforeCursor) {
      newCursorPos = newFormatted.length;
    }

    cursorPositionRef.current = newCursorPos;
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      input.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current
      );
    }
  });

  useEffect(() => {
    onValueChange?.(isValid ? normalized : undefined);
  }, [raw, isValid, normalized, onValueChange]);

  return (
    <div className={containerClass}>
      {showLabel &&
        label &&
        (renderLabel ? (
          renderLabel(label)
        ) : (
          <label className={labelClass}>{label}</label>
        ))}

      <div
        className={wrapperClass}
        style={{
          borderColor: !isValid && raw.length >= 3 ? "#ef4444" : undefined,
        }}
      >
        {renderFlag ? (
          renderFlag()
        ) : (
          <div className={flagClass}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
              <rect width="30" height="20" fill="#006a4e" />
              <circle cx="12.5" cy="10" r="5" fill="#f42a41" />
            </svg>
          </div>
        )}

        {renderPrefix ? (
          renderPrefix()
        ) : (
          <span className={prefixClass}>+880</span>
        )}

        <input
          ref={inputRef}
          className={inputClass}
          placeholder="1XX XXXX XXXX"
          value={formatBDPhoneUI(raw)}
          onChange={handleChange}
        />
      </div>

      {showError &&
        raw.length >= 3 &&
        error &&
        (renderError ? (
          renderError(error)
        ) : (
          <span className={errorClass}>{error}</span>
        ))}
    </div>
  );
}
