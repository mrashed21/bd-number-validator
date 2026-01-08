// src/validate.ts
function validatePhoneNumber(input) {
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
  const operators = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"]
  };
  let operator = "Unknown";
  if (raw.length >= 3) {
    const prefix = raw.slice(0, 3);
    for (const [name, prefixList] of Object.entries(operators)) {
      if (prefixList.includes(prefix)) {
        operator = name;
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
    return { isValid: false, error: "Invalid number" };
  }
  if (raw.length > 11) {
    return { isValid: false, error: "Invalid number" };
  }
  if (raw.length === 11) {
    const normalized = "+880" + raw.slice(1);
    return {
      isValid: true,
      operator,
      normalized
    };
  }
  return { isValid: false, error: "Invalid number" };
}

// src/react/useBDPhone.ts
import { useState } from "react";
function useBDPhone(initial = "") {
  const [value, setValue] = useState(initial);
  const onChange = (v) => {
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
    onChange
  };
}

// src/react/BDPhoneInput.tsx
import { useEffect, useRef } from "react";

// src/react/formatBDPhoneUI.ts
function formatBDPhoneUI(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 13)}`;
}

// src/react/BDPhoneInput.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function BDPhoneInput({
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
  renderError
}) {
  const { raw, onChange, error, isValid, normalized } = useBDPhone(value != null ? value : "");
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(0);
  const handleChange = (e) => {
    var _a;
    const input = e.target;
    const cursorPos = (_a = input.selectionStart) != null ? _a : 0;
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
    onValueChange == null ? void 0 : onValueChange(isValid ? normalized : void 0);
  }, [raw, isValid, normalized, onValueChange]);
  return /* @__PURE__ */ jsxs("div", { className: containerClass, children: [
    showLabel && label && (renderLabel ? renderLabel(label) : /* @__PURE__ */ jsx("label", { className: labelClass, children: label })),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: wrapperClass,
        style: {
          borderColor: !isValid && raw.length >= 3 ? "#ef4444" : void 0
        },
        children: [
          renderFlag ? renderFlag() : /* @__PURE__ */ jsx("div", { className: flagClass, children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 30 20", children: [
            /* @__PURE__ */ jsx("rect", { width: "30", height: "20", fill: "#006a4e" }),
            /* @__PURE__ */ jsx("circle", { cx: "12.5", cy: "10", r: "5", fill: "#f42a41" })
          ] }) }),
          renderPrefix ? renderPrefix() : /* @__PURE__ */ jsx("span", { className: prefixClass, children: "+880" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              className: inputClass,
              placeholder: "1XX XXXX XXXX",
              value: formatBDPhoneUI(raw),
              onChange: handleChange
            }
          )
        ]
      }
    ),
    showError && raw.length >= 3 && error && (renderError ? renderError(error) : /* @__PURE__ */ jsx("span", { className: errorClass, children: error }))
  ] });
}

export {
  validatePhoneNumber,
  useBDPhone,
  BDPhoneInput
};
