import {
  BDPhoneInput,
  useBDPhone
} from "./chunk-N7GKHXTX.js";

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
export {
  BDPhoneInput,
  useBDPhone
};
