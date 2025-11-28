# 📱 bd-number-validator

**Bangladesh Phone Number Validator + React Input Component**

[![npm version](https://img.shields.io/npm/v/bd-number-validator.svg)](https://www.npmjs.com/package/bd-number-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, production-ready validator for Bangladesh mobile numbers with full normalization, operator detection, and a beautiful React input component with TailwindCSS support.

**Author:** Muhammad Rashed  
**Version:** 1.0.6

---

## ⭐ Features

- ✅ **Multiple Format Support** - Accepts all valid BD formats:
  - `+8801781131905`
  - `8801781131905`
  - `01781131905`
  - `1781131905`
- ✅ **Auto Normalization** - Converts all inputs to `+8801781131905` format

- ✅ **Operator Detection** - Identifies carrier:

  - Grameenphone
  - Robi
  - Banglalink
  - Airtel
  - Teletalk

- ✅ **Live Validation** - Real-time error feedback
- ✅ **Error Handling** - Clear, actionable error messages
- ✅ **Raw Numeric Input** - No auto-formatting during input
- ✅ **Ready React Component** - Beautiful, Tailwind-friendly UI
- ✅ **React Hook Form Compatible** - Easy form integration
- ✅ **Full TypeScript Support** - Type-safe development

---

## 📦 Installation

```bash
npm install bd-number-validator
```

**or**

```bash
yarn add bd-number-validator
```

---

## 🧠 Core Validator Usage

### Basic Validation

```javascript
import { validatePhoneNumber } from "bd-number-validator";

const result = validatePhoneNumber("01712345678");

console.log(result);
/*
{
  isValid: true,
  normalized: '+8801712345678',
  operator: 'Grameenphone'
}
*/
```

### Pre-Submit Validation

```javascript
const result = validatePhoneNumber(phoneInput);

if (!result.isValid) {
  alert(result.error);
  return;
}

// Proceed with submission using result.normalized
submitForm({ phone: result.normalized });
```

---

## ⚛️ React Hook Usage

```javascript
import { useBDPhone } from "bd-number-validator/react";

function App() {
  const { raw, error, normalized, operator, onChange } = useBDPhone("");

  return (
    <div>
      <input
        type="text"
        value={raw}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter phone number"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {normalized && (
        <div>
          <p>Normalized: {normalized}</p>
          <p>Operator: {operator}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 React Component (Ready-Made UI)

### Basic Usage

```javascript
import { BDPhoneInput } from "bd-number-validator/react";

export default function Demo() {
  return (
    <BDPhoneInput
      onValueChange={(value) => console.log(value)}
      showError={true}
    />
  );
}
```

### Custom Error Styling

```javascript
<BDPhoneInput
  onValueChange={(v) => console.log(v)}
  customError={(msg) => (
    <div className="text-red-600 font-bold flex items-center gap-2">
      <span>⚠️</span>
      <span>{msg}</span>
    </div>
  )}
/>
```

### Full Tailwind Customization

```javascript
<BDPhoneInput
  wrapperClass="flex flex-col gap-2"
  inputBoxClass="border-2 border-gray-300 p-3 bg-gray-50 rounded-lg focus-within:border-blue-500"
  inputClass="bg-transparent flex-1 outline-none"
  labelClass="text-sm font-medium text-gray-700"
  showError={true}
  placeholder="01XXXXXXXXX"
  onValueChange={(v) => setPhone(v.normalized)}
/>
```

---

## 📚 API Reference

### `validatePhoneNumber(phone: string)`

**Returns:**

| Property     | Type             | Description                          |
| ------------ | ---------------- | ------------------------------------ |
| `isValid`    | `boolean`        | Whether the number is valid          |
| `error`      | `string \| null` | Error message if invalid             |
| `normalized` | `string \| null` | Normalized format (`+8801XXXXXXXXX`) |
| `operator`   | `string \| null` | Detected operator name               |

### `useBDPhone(initialValue: string)`

**Returns:**

| Property     | Type                      | Description              |
| ------------ | ------------------------- | ------------------------ |
| `raw`        | `string`                  | Current input value      |
| `error`      | `string \| null`          | Validation error message |
| `normalized` | `string \| null`          | Normalized phone number  |
| `operator`   | `string \| null`          | Detected operator        |
| `onChange`   | `(value: string) => void` | Input change handler     |

### `<BDPhoneInput />` Props

| Prop            | Type                 | Default         | Description                     |
| --------------- | -------------------- | --------------- | ------------------------------- |
| `onValueChange` | `(result) => void`   | -               | Callback with validation result |
| `showError`     | `boolean`            | `true`          | Show error messages             |
| `placeholder`   | `string`             | `"01XXXXXXXXX"` | Input placeholder               |
| `wrapperClass`  | `string`             | -               | Container class                 |
| `inputBoxClass` | `string`             | -               | Input wrapper class             |
| `inputClass`    | `string`             | -               | Input element class             |
| `labelClass`    | `string`             | -               | Label class                     |
| `customError`   | `(msg) => ReactNode` | -               | Custom error renderer           |

---

## 🛠 Operator Detection

| Operator         | Prefixes |
| ---------------- | -------- |
| **Grameenphone** | 017, 013 |
| **Banglalink**   | 019, 014 |
| **Robi**         | 018      |
| **Airtel**       | 016      |
| **Teletalk**     | 015      |

---

## 🧪 Example Outputs

### Valid Number

```javascript
validatePhoneNumber("01712345678");
// {
//   isValid: true,
//   error: null,
//   normalized: '+8801712345678',
//   operator: 'Grameenphone'
// }
```

### Invalid Number

```javascript
validatePhoneNumber("01212345678");
// {
//   isValid: false,
//   error: "Invalid operator prefix",
//   normalized: null,
//   operator: null
// }
```

### Invalid Length

```javascript
validatePhoneNumber("017123");
// {
//   isValid: false,
//   error: "Phone number must be 11 digits",
//   normalized: null,
//   operator: null
// }
```

---

## 🔧 Integration Examples

### With React Hook Form

```javascript
import { useForm } from "react-hook-form";
import { BDPhoneInput } from "bd-number-validator/react";

function SignupForm() {
  const { register, handleSubmit, setValue } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BDPhoneInput
        onValueChange={(result) => {
          if (result.isValid) {
            setValue("phone", result.normalized);
          }
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Form Validation

```javascript
const [phone, setPhone] = useState("");
const [error, setError] = useState("");

const handleSubmit = () => {
  const result = validatePhoneNumber(phone);

  if (!result.isValid) {
    setError(result.error);
    return;
  }

  // Submit with result.normalized
  api.post("/signup", { phone: result.normalized });
};
```

---

## 📄 License

MIT © Muhammad Rashed

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/bd-number-validator/issues).

---

## 📧 Support

For support, email rashedjaman@gmail.com or open an issue on GitHub.

---
