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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BDPhoneInput: () => BDPhoneInput,
  useBDPhone: () => useBDPhone,
  validatePhoneNumber: () => validatePhoneNumber
});
module.exports = __toCommonJS(src_exports);

// src/react/BDPhoneInput.tsx
var import_react2 = __toESM(require("react"), 1);

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

// src/react/useBDPhone.ts
var import_react = require("react");

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
  import_react2.default.useEffect(() => {
    onValueChange == null ? void 0 : onValueChange(isValid ? normalized : void 0);
  }, [raw, isValid]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${wrapperClass} ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: labelClass, children: label }),
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
              className: inputClass,
              placeholder: "enter phone number",
              value: raw,
              onChange: (e) => onChange(e.target.value)
            }
          )
        ]
      }
    ),
    showError && error && (customError ? customError(error) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bdp-error-text", children: error }))
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BDPhoneInput,
  useBDPhone,
  validatePhoneNumber
});
