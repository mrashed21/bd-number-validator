/*
  case 01.
  input : "8801781131905"
  row hobe -> "01781131905"
  operator check korbe -> "017"
  normalized hobe -> "+8801781131905"

  ekhane age input ke raw banate hobe tarpor row input er frist 3 digit check kore operator ber korte hobe, jodi operator thik thake tahole kono error dibe na ar jodi operator match na kore tahole invalid operator error dibe. erpor suru hobe length check, jodi row input er length 11 er kom hoy tahole invaalic number dibe, abar jodi  11 er beshi hoy taholeo invalid number dibe, jodi 11 hoy abar operator thik thake tahole valid hobe.

   case 02.
  input : "801781131905"
  row hobe -> "01781131905"
  operator check korbe -> "017"
  normalized hobe -> "+8801781131905"

  ekhane age input ke raw banate hobe tarpor row input er frist 3 digit check kore operator ber korte hobe, jodi operator thik thake tahole kono error dibe na ar jodi operator match na kore tahole invalid operator error dibe. erpor suru hobe length check, jodi row input er length 11 er kom hoy tahole invaalic number dibe, abar jodi  11 er beshi hoy taholeo invalid number dibe, jodi 11 hoy abar operator thik thake tahole valid hobe.

 case 03. 
 input : "01781131905"
 row hobe -> "01781131905"
 operator check korbe -> "017"
 normalized hobe -> "+8801781131905"

 ekhane age input ke raw banate hobe tarpor row input er frist 3 digit check kore operator ber korte hobe, jodi operator thik thake tahole kono error dibe na ar jodi operator match na kore tahole invalid operator error dibe. erpor suru hobe length check, jodi row input er length 11 er kom hoy tahole invaalic number dibe, abar jodi  11 er beshi hoy taholeo invalid number dibe, jodi 11 hoy abar operator thik thake tahole valid hobe.

 case 04.
 input : "1781131905"
 row hobe -> "+01781131905"
 operator check korbe -> "017"
 normalized hobe -> "+8801781131905"

 ekhane age input ke raw banate hobe, input er sathe "0" add korte raw banate hobe. tarpor row input er frist 3 digit check kore operator ber korte hobe, jodi operator thik thake tahole kono error dibe na ar jodi operator match na kore tahole invalid operator error dibe. erpor suru hobe length check, jodi row input er length 11 er kom hoy tahole invaalic number dibe, abar jodi  11 er beshi hoy taholeo invalid number dibe, jodi 11 hoy abar operator thik thake tahole valid hobe.

  */

/*
  Bangladesh Phone Number Validator
  
  Validation Logic:
  1. Input normalize করে raw format এ নিয়ে আসা (01XXXXXXXXX)
  2. Operator check (first 3 digits)
  3. Length validation (must be exactly 11 digits)
  4. If valid, return normalized format (+8801XXXXXXXXX)
*/

export type Operator =
  | "Grameenphone"
  | "Banglalink"
  | "Robi"
  | "Airtel"
  | "Teletalk"
  | "Unknown";

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?: string;
  operator?: Operator;
  error?: string;
}

export function validatePhoneNumber(input: string): PhoneValidationResult {
  console.log(input);
  // Empty input handling
  if (!input || input.trim() === "") {
    return { isValid: false };
  }

  // Remove all non-digit characters
  let value = input.replace(/[^0-9]/g, "");

  // -----------------------------------------
  // STEP 1: NORMALIZE TO RAW FORMAT (01XXXXXXXXX)
  // -----------------------------------------
  let raw = "";

  if (value.startsWith("8801")) {
    // Case: 8801781131905 → 01781131905
    raw = value.slice(2);
  } else if (value.startsWith("880")) {
    // Case: 8801781131905 → 01781131905
    raw = value.slice(2);
  } else if (value.startsWith("80")) {
    // Case: 801781131905 → 01781131905
    raw = value.slice(1);
  } else if (value.startsWith("0")) {
    // Case: 01781131905 → 01781131905 (already correct)
    raw = value;
  } else if (value.startsWith("1")) {
    // Case: 1781131905 → 01781131905
    raw = "0" + value;
  } else {
    // Invalid format
    return { isValid: false, error: "Invalid number format" };
  }

  // -----------------------------------------
  // STEP 2: OPERATOR CHECK (First 3 digits)
  // -----------------------------------------
  const operators: Record<Operator, string[]> = {
    Grameenphone: ["017", "013"],
    Banglalink: ["019", "014"],
    Robi: ["018"],
    Airtel: ["016"],
    Teletalk: ["015"],
    Unknown: [],
  };

  // Check operator only if we have at least 3 digits
  let operator: Operator = "Unknown";

  if (raw.length >= 3) {
    const prefix = raw.slice(0, 3);

    for (const [name, prefixList] of Object.entries(operators)) {
      if (prefixList.includes(prefix)) {
        operator = name as Operator;
        break;
      }
    }

    // If 3 digits typed but operator not found → invalid
    if (operator === "Unknown") {
      return { isValid: false, error: "Invalid operator" };
    }
  }

  // -----------------------------------------
  // STEP 3: LENGTH VALIDATION
  // -----------------------------------------

  // Still typing (less than 3 digits) → no error
  if (raw.length < 3) {
    return { isValid: true };
  }

  // Exactly 3 digits → operator validated, continue typing
  if (raw.length === 3) {
    return { isValid: true, operator };
  }

  // Between 4-10 digits → invalid length
  if (raw.length > 3 && raw.length < 11) {
    return { isValid: false, error: "Invalid number" };
  }

  // More than 11 digits → invalid
  if (raw.length > 11) {
    return { isValid: false, error: "Invalid number" };
  }

  // Exactly 11 digits → VALID! ✓
  if (raw.length === 11) {
    return {
      isValid: true,
      operator,
      normalized: "+880" + raw.slice(1), // Remove leading 0, add +880
    };
  }

  // Fallback (should never reach here)
  return { isValid: false, error: "Invalid number" };
}

// // -----------------------------------------
// // TEST CASES
// // -----------------------------------------

// console.log("=== Test Cases ===\n");

// const testCases = [
//   "8801781131905", // Case 1
//   "801781131905", // Case 2
//   "01781131905", // Case 3
//   "1781131905", // Case 4
//   "01912345678", // Banglalink
//   "01812345678", // Robi
//   "01612345678", // Airtel
//   "01512345678", // Teletalk
//   "01112345678", // Invalid operator
//   "017811319", // Too short
//   "017811319055", // Too long
// ];

// testCases.forEach((test) => {
//   const result = validatePhoneNumber(test);
//   console.log(`Input: ${test}`);
//   console.log(`Result:`, result);
//   console.log("---");
// });
