export function formatBDPhoneUI(raw: string): string {
  if (!raw) return "";

  const digits = raw.replace(/\D/g, "");

  // -----------------------------
  // CASE 1: Starts with "880" (International BD)
  // -----------------------------
  if (digits.startsWith("880")) {
    // 880
    if (digits.length <= 3) return digits;

    // 880 1
    if (digits.length <= 4) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

    // 880 1781
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

    // 880 1781 1
    if (digits.length <= 8)
      return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;

    // 880 1781 131905 (up to 13 digits)
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // -----------------------------
  // CASE 2: Starts with "01" (Bangladesh standard)
  // -----------------------------
  if (digits.startsWith("01")) {
    // 017
    if (digits.length <= 3) return digits;

    // 017 8
    if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

    // 017 8113 1905
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }

  // -----------------------------
  // CASE 3: Starts with "1" (Short raw format: 1781131905)
  // -----------------------------
  if (digits.startsWith("1")) {
    // 1 / 17
    if (digits.length <= 2) return digits;

    // 17 8113
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;

    // 17 8113 1905
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }

  // -----------------------------
  // DEFAULT fallback (format like 017 8113 1905)
  // -----------------------------
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}
