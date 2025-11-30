import React, { useEffect, useRef, useState } from "react";

// ============================================
// TYPES
// ============================================
type Operator =
  | "Grameenphone"
  | "Banglalink"
  | "Robi"
  | "Airtel"
  | "Teletalk"
  | "Unknown";

interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  operator?: Operator;
  error?: string;
}

// ============================================
// VALIDATION FUNCTION (CORRECT LOGIC)
// ============================================
function validatePhoneNumber(input: string): PhoneValidationResult {
  // Empty input handling
  if (!input || input.trim() === "") {
    return { isValid: true };
  }

  // Remove all non-digit characters
  let value = input.replace(/[^0-9]/g, "");

  // -----------------------------------------
  // STEP 1: NORMALIZE TO RAW FORMAT (01XXXXXXXXX - 11 digits)
  // -----------------------------------------
  let raw = "";

  // Case 1: 8801781131905 (13 digits) → 01781131905
  if (value.startsWith("8801")) {
    raw = value.slice(2); // Remove "88"
  }
  // Case 2: 880781131905 (12 digits) → 01781131905
  else if (value.startsWith("880")) {
    raw = "0" + value.slice(3); // Remove "880", add "0"
  }
  // Case 3: 801781131905 (12 digits) → 01781131905
  else if (value.startsWith("801")) {
    raw = value.slice(1); // Remove "8"
  }
  // Case 4: 80781131905 (11 digits) → 01781131905
  else if (value.startsWith("80")) {
    raw = "0" + value.slice(2); // Remove "80", add "0"
  }
  // Case 5: 01781131905 (11 digits) → 01781131905
  else if (value.startsWith("0")) {
    raw = value; // Already correct
  }
  // Case 6: 1781131905 (10 digits) → 01781131905
  else {
    raw = "0" + value; // Add "0" at start
  }

  console.log("Input:", value, "→ Raw:", raw, "Length:", raw.length);

  // -----------------------------------------
  // STEP 2: OPERATOR CHECK (First 3 digits of raw)
  // -----------------------------------------
  const operators: Record<string, string[]> = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"],
  };

  let operator: Operator = "Unknown";

  // Only check operator if we have at least 3 digits
  if (raw.length >= 3) {
    const prefix = raw.slice(0, 3);
    console.log("Checking prefix:", prefix);

    for (const [name, prefixList] of Object.entries(operators)) {
      if (prefixList.includes(prefix)) {
        operator = name as Operator;
        console.log("✓ Operator found:", operator);
        break;
      }
    }

    // If we have 3+ digits but operator not found → ERROR
    if (operator === "Unknown") {
      console.log("✗ Invalid operator:", prefix);
      return { isValid: false, error: "Invalid operator" };
    }
  }

  // -----------------------------------------
  // STEP 3: LENGTH CHECK
  // -----------------------------------------

  // Less than 3 digits → still typing, no error
  if (raw.length < 3) {
    return { isValid: true };
  }

  // Exactly 3 digits → operator validated, continue
  if (raw.length === 3) {
    return { isValid: true, operator };
  }

  // Between 4-10 digits → INVALID (too short)
  if (raw.length > 3 && raw.length < 11) {
    return { isValid: false, error: "Invalid number" };
  }

  // More than 11 digits → INVALID (too long)
  if (raw.length > 11) {
    return { isValid: false, error: "Invalid number" };
  }

  // Exactly 11 digits + valid operator → VALID! ✓
  if (raw.length === 11) {
    const normalized = "+880" + raw.slice(1); // Remove "0", add "+880"
    console.log("✓ Valid! Normalized:", normalized);
    return {
      isValid: true,
      operator,
      normalized,
    };
  }

  return { isValid: false, error: "Invalid number" };
}

// ============================================
// FORMAT FUNCTION
// ============================================
function formatBDPhoneUI(raw: string): string {
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");

  // Format as: 017 8113 1905 (3-4-4 pattern)
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
}

// ============================================
// HOOK
// ============================================
function useBDPhone(initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = (v: string) => {
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
    onChange,
  };
}

// ============================================
// COMPONENT
// ============================================
interface BDPhoneInputProps {
  value?: string;
  onValueChange?: (v?: string) => void;
  showError?: boolean;
  label?: string;
}

function BDPhoneInput({
  value,
  onValueChange,
  showError = true,
  label = "Phone Number",
}: BDPhoneInputProps) {
  const { raw, onChange, error, isValid, normalized, operator } = useBDPhone(
    value ?? ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorPos = input.selectionStart ?? 0;
    const newValue = e.target.value;

    const newDigits = newValue.replace(/\D/g, "");

    // Calculate max allowed input length based on prefix
    let maxLength = 11; // Default for formats like 01XXXXXXXXX or 1XXXXXXXXX

    if (newDigits.startsWith("8801")) {
      maxLength = 13; // For 8801781131905
    } else if (newDigits.startsWith("880")) {
      maxLength = 13; // For 880781131905
    } else if (newDigits.startsWith("801")) {
      maxLength = 12; // For 801781131905
    } else if (newDigits.startsWith("80")) {
      maxLength = 12; // For 80781131905
    } else if (newDigits.startsWith("0")) {
      maxLength = 11; // For 01781131905
    } else {
      maxLength = 10; // For 1781131905
    }

    const limitedDigits = newDigits.slice(0, maxLength);

    let digitsBeforeCursor = 0;
    for (let i = 0; i < cursorPos && i < newValue.length; i++) {
      if (/\d/.test(newValue[i])) {
        digitsBeforeCursor++;
      }
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
    <div style={{ maxWidth: "400px", margin: "20px" }}>
      {label && (
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 12px",
          border: `2px solid ${
            !isValid && raw.length >= 3 ? "#ef4444" : "#d1d5db"
          }`,
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        <div style={{ width: "24px", height: "16px", flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
            <rect width="30" height="20" fill="#006a4e" />
            <circle cx="12.5" cy="10" r="5" fill="#f42a41" />
          </svg>
        </div>
        <span style={{ color: "#6b7280", fontWeight: 500 }}>+880</span>

        <input
          ref={inputRef}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "16px",
            fontFamily: "monospace",
          }}
          placeholder="1XX XXXX XXXX"
          value={formatBDPhoneUI(raw)}
          onChange={handleChange}
        />
      </div>

      {showError && raw.length >= 3 && error && (
        <span
          style={{
            display: "block",
            marginTop: "6px",
            color: "#ef4444",
            fontSize: "14px",
          }}
        >
          {error}
        </span>
      )}

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#374151",
          fontFamily: "monospace",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ marginBottom: "4px" }}>
          <strong>Debug Info:</strong>
        </div>
        <div>
          Input: <span style={{ color: "#6366f1" }}>{raw || "(empty)"}</span>{" "}
          (Length: {raw.length})
        </div>
        <div>
          Operator:{" "}
          <span
            style={{ color: operator !== "Unknown" ? "#10b981" : "#f59e0b" }}
          >
            {operator || "Not detected"}
          </span>
        </div>
        <div>
          Valid:{" "}
          <span style={{ color: isValid ? "#10b981" : "#ef4444" }}>
            {isValid ? "✓ Yes" : "✗ No"}
          </span>
        </div>
        {normalized && (
          <div>
            Normalized: <span style={{ color: "#10b981" }}>{normalized}</span>
          </div>
        )}
        {error && (
          <div>
            Error: <span style={{ color: "#ef4444" }}>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// DEMO APP
// ============================================
export default function App() {
  const [phone, setPhone] = useState<string>();

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "8px" }}>Bangladesh Phone Input</h1>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Operator check fixed - console দেখুন!
        </p>

        <BDPhoneInput
          value={phone}
          onValueChange={setPhone}
          label="Mobile Number"
        />

        {phone && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #86efac",
            }}
          >
            <strong style={{ color: "#16a34a" }}>✓ Valid Phone:</strong>
            <span style={{ marginLeft: "8px", fontFamily: "monospace" }}>
              {phone}
            </span>
          </div>
        )}

        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Test Cases (Browser Console দেখুন):</h3>
          <ul
            style={{
              fontSize: "14px",
              lineHeight: "2",
              fontFamily: "monospace",
            }}
          >
            <li>
              <strong>Case 1:</strong> <code>8801781131905</code> (13 digits) →
              Raw: 01781131905 → ✓
            </li>
            <li>
              <strong>Case 2:</strong> <code>801781131905</code> (12 digits) →
              Raw: 01781131905 → ✓
            </li>
            <li>
              <strong>Case 3:</strong> <code>01781131905</code> (11 digits) →
              Raw: 01781131905 → ✓
            </li>
            <li>
              <strong>Case 4:</strong> <code>1781131905</code> (10 digits) →
              Raw: 01781131905 → ✓
            </li>
          </ul>
          <p
            style={{
              marginTop: "16px",
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: 0,
            }}
          >
            ✅ এখন সব format এ পুরো number input নিতে পারবে!
          </p>
        </div>
      </div>
    </div>
  );
}
