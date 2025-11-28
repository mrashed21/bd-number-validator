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
export {
  validatePhoneNumber
};
