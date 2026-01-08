"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  BDPhoneInput: () => BDPhoneInput,
  useBDPhone: () => useBDPhone
});
module.exports = __toCommonJS(react_exports);

// src/react/BDPhoneInput.tsx
var import_react2 = require("react");

// src/react/formatBDPhoneUI.ts
function formatBDPhoneUI(raw) {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 13)}`;
}

// src/react/useBDPhone.ts
var import_react = require("react");

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
function useBDPhone(initial = "") {
  const [value, setValue] = (0, import_react.useState)(initial);
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
var import_jsx_runtime = require("react/jsx-runtime");
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
  const inputRef = (0, import_react2.useRef)(null);
  const cursorPositionRef = (0, import_react2.useRef)(0);
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
  (0, import_react2.useEffect)(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      input.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current
      );
    }
  });
  (0, import_react2.useEffect)(() => {
    onValueChange == null ? void 0 : onValueChange(isValid ? normalized : void 0);
  }, [raw, isValid, normalized, onValueChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: containerClass, children: [
    showLabel && label && (renderLabel ? renderLabel(label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: labelClass, children: label })),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: wrapperClass,
        style: {
          borderColor: !isValid && raw.length >= 3 ? "#ef4444" : void 0
        },
        children: [
          renderFlag ? renderFlag() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: flagClass, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 30 20", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { width: "30", height: "20", fill: "#006a4e" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12.5", cy: "10", r: "5", fill: "#f42a41" })
          ] }) }),
          renderPrefix ? renderPrefix() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: prefixClass, children: "+880" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    showError && raw.length >= 3 && error && (renderError ? renderError(error) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: errorClass, children: error }))
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BDPhoneInput,
  useBDPhone
});
