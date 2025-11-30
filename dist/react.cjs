"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  BDPhoneInput: () => BDPhoneInput,
  useBDPhone: () => useBDPhone
});
module.exports = __toCommonJS(react_exports);

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

// src/react/BDPhoneInput.tsx
var import_react2 = __toESM(require("react"), 1);

// src/react/formatBDPhoneUI.ts
function formatBDPhoneUI(raw) {
  if (!raw)
    return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("880")) {
    if (digits.length <= 3)
      return digits;
    if (digits.length <= 4)
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 7)
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8)
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  if (digits.startsWith("01")) {
    if (digits.length <= 3)
      return digits;
    if (digits.length <= 7)
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  if (digits.startsWith("1")) {
    if (digits.length <= 2)
      return digits;
    if (digits.length <= 6)
      return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  if (digits.length <= 3)
    return digits;
  if (digits.length <= 7)
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}

// src/react/useBDPhone.ts
var import_react = require("react");

// src/validate.ts
function validatePhoneNumber(input) {
  console.log(input);
  if (!input || input.trim() === "") {
    return { isValid: false };
  }
  let value = input.replace(/[^0-9]/g, "");
  let raw = "";
  if (value.startsWith("8801")) {
    raw = value.slice(2);
  } else if (value.startsWith("880")) {
    raw = value.slice(2);
  } else if (value.startsWith("80")) {
    raw = value.slice(1);
  } else if (value.startsWith("0")) {
    raw = value;
  } else if (value.startsWith("1")) {
    raw = "0" + value;
  } else {
    return { isValid: false, error: "Invalid number format" };
  }
  const operators = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"],
    Unknown: []
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
    return {
      isValid: true,
      operator,
      normalized: "+880" + raw.slice(1)
      // Remove leading 0, add +880
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
  customError,
  label = "",
  className = "",
  wrapperClass = "bdp-wrapper",
  inputBoxClass = "bdp-input-box",
  inputClass = "bdp-input",
  labelClass = "bdp-label"
}) {
  const { raw, onChange, error, isValid, normalized } = useBDPhone(value != null ? value : "");
  console.log("error: ", error);
  console.log("raw: ", raw);
  console.log("onChange: ", onChange);
  console.log("isValid: ", isValid);
  console.log("normalized: ", normalized);
  const inputRef = import_react2.default.useRef(null);
  const handleChange = (e) => {
    var _a;
    const cursor = (_a = e.target.selectionStart) != null ? _a : 0;
    const before = formatBDPhoneUI(raw);
    const newDigits = e.target.value.replace(/\D/g, "");
    onChange(newDigits);
    const after = formatBDPhoneUI(newDigits);
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input)
        return;
      const diff = after.length - before.length;
      input.selectionStart = input.selectionEnd = cursor + diff;
    });
  };
  import_react2.default.useEffect(() => {
    onValueChange == null ? void 0 : onValueChange(isValid ? normalized : void 0);
  }, [raw, isValid]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${wrapperClass} ${className}`, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: labelClass, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: `${inputBoxClass} ${!isValid && raw ? "bdp-error-border" : ""}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bdp-flag", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 30 20", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { width: "30", height: "20", fill: "#006a4e" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12.5", cy: "10", r: "5", fill: "#f42a41" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bdp-prefix", children: "+880" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              ref: inputRef,
              className: inputClass,
              placeholder: "enter phone number",
              value: formatBDPhoneUI(raw),
              onChange: handleChange
            }
          )
        ]
      }
    ),
    showError && raw.length >= 3 && error && (customError ? customError(error) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bdp-error-text", children: error }))
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BDPhoneInput,
  useBDPhone
});
