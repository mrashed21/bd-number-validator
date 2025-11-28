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

// src/react/BDPhoneInput.tsx
var import_react2 = __toESM(require("react"), 1);

// src/react/flag.svg
var flag_default = "./flag-3WJGD64X.svg";

// src/react/useBDPhone.ts
var import_react = require("react");

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
  import_react2.default.useEffect(() => {
    onValueChange == null ? void 0 : onValueChange(isValid ? normalized : void 0);
  }, [raw, isValid]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${wrapperClass} ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: labelClass, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `${inputBoxClass} ${!isValid ? "bdp-error-border" : ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: BD_FLAG, className: "bdp-flag" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bdp-prefix", children: "+880" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: inputClass,
          placeholder: "1XXXXXXXXX",
          value: raw,
          onChange: (e) => onChange(e.target.value)
        }
      )
    ] }),
    showError && error && (customError ? customError(error) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bdp-error-text", children: error }))
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BDPhoneInput,
  useBDPhone
});
