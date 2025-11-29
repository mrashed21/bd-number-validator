// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined")
    return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// src/react/bd-phone.css
styleInject(".bdp-wrapper {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  width: 100%;\n}\n.bdp-label {\n  font-size: 14px;\n  font-weight: 500;\n  color: #374151;\n}\n.bdp-input-box {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: #ffffff;\n  border: 1px solid #d1d5db;\n  padding: 12px;\n  border-radius: 8px;\n  transition: 0.2s border ease;\n}\n.bdp-error-border {\n  border-color: #ef4444 !important;\n}\n.bdp-flag {\n  width: 30px;\n  height: 25px;\n  border-radius: 3px;\n}\n.bdp-prefix {\n  font-weight: 700;\n  color: #1f2937;\n}\n.bdp-input {\n  flex: 1;\n  border: none;\n  outline: none;\n  background: transparent;\n  font-size: 16px;\n  color: #111827;\n}\n.bdp-error-text {\n  font-size: 14px;\n  color: #dc2626;\n}\n");

// src/validate.ts
function validatePhoneNumber(input) {
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
    normalized: "+880" + raw.slice(1),
    operator
  };
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
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${inputBoxClass} ${!isValid && raw ? "bdp-error-border" : ""}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "bdp-flag", children: /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 30 20", children: [
            /* @__PURE__ */ jsx("rect", { width: "30", height: "20", fill: "#006a4e" }),
            /* @__PURE__ */ jsx("circle", { cx: "12.5", cy: "10", r: "5", fill: "#f42a41" })
          ] }) }),
          /* @__PURE__ */ jsx("span", { className: "bdp-prefix", children: "+880" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: inputClass,
              placeholder: "enter phone number",
              value: raw,
              onChange: (e) => onChange(e.target.value)
            }
          )
        ]
      }
    ),
    showError && error && (customError ? customError(error) : /* @__PURE__ */ jsx("span", { className: "bdp-error-text", children: error }))
  ] });
}

export {
  validatePhoneNumber,
  useBDPhone,
  BDPhoneInput
};
