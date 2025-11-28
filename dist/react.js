// src/react/BDPhoneInput.tsx
import React from "react";

// src/react/flag.svg
var flag_default = "./flag-3WJGD64X.svg";

// src/react/useBDPhone.ts
import { useState } from "react";

// src/validate.ts
function validatePhoneNumber(input) {
  if (!input)
    return { isValid: true };
  let raw = input.replace(/[^0-9]/g, "");
  if (raw.length < 4) {
    return { isValid: true };
  }
  if (raw.startsWith("880") && raw.length === 13) {
    raw = "0" + raw.slice(3);
  } else if (raw.length === 10 && raw.startsWith("1")) {
    raw = "0" + raw;
  } else if (!(raw.length === 11 && raw.startsWith("01")) && !raw.startsWith("880")) {
    return { isValid: false, error: "Invalid number format" };
  }
  const prefix = raw.slice(0, 3);
  const operators = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"],
    Unknown: []
  };
  let operator = "Unknown";
  for (const [op, arr] of Object.entries(operators)) {
    if (arr.includes(prefix))
      operator = op;
  }
  if (operator === "Unknown") {
    return { isValid: false, error: "Invalid operator prefix" };
  }
  return {
    isValid: true,
    normalized: "+880" + raw.substring(1),
    operator
  };
}

// src/react/useBDPhone.ts
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
import { jsx, jsxs } from "react/jsx-runtime";
var BD_FLAG = flag_default;
function BDPhoneInput({
  value,
  onValueChange,
  showError = true,
  customError,
  label = "",
  className = "",
  wrapperClass = "bdp-wrapper",
  inputBoxClass = "bdp-input-box",
  inputClass = "bdp-input",
  labelClass = "bdp-label"
}) {
  const { raw, onChange, error, isValid, normalized } = useBDPhone(value != null ? value : "");
  React.useEffect(() => {
    onValueChange == null ? void 0 : onValueChange(isValid ? normalized : void 0);
  }, [raw, isValid]);
  return /* @__PURE__ */ jsxs("div", { className: `${wrapperClass} ${className}`, children: [
    /* @__PURE__ */ jsx("label", { className: labelClass, children: label }),
    /* @__PURE__ */ jsxs("div", { className: `${inputBoxClass} ${!isValid ? "bdp-error-border" : ""}`, children: [
      /* @__PURE__ */ jsx("img", { src: BD_FLAG, className: "bdp-flag" }),
      /* @__PURE__ */ jsx("span", { className: "bdp-prefix", children: "+880" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: inputClass,
          placeholder: "1XXXXXXXXX",
          value: raw,
          onChange: (e) => onChange(e.target.value)
        }
      )
    ] }),
    showError && error && (customError ? customError(error) : /* @__PURE__ */ jsx("span", { className: "bdp-error-text", children: error }))
  ] });
}
export {
  BDPhoneInput,
  useBDPhone
};
