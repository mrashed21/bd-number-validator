# 📱 bd-number-validator

**Bangladesh Phone Number Validator + React Input Component**

A lightweight, production-ready validator for Bangladesh mobile numbers with normalization, operator detection, React components, hook support, and full React Hook Form integration.

[![npm version](https://img.shields.io/npm/v/bd-number-validator.svg)](https://www.npmjs.com/package/bd-number-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Author:** Muhammad Rashed  
**Version:** 1.0.8

---

## ⭐ Features

- ✅ **Multiple Format Support** - Accepts `+8801781131905`, `8801781131905`, `01781131905`, `1781131905`
- ✅ **Auto Normalization** - Returns standardized `+8801781131905` format
- ✅ **Operator Detection** - Identifies Grameenphone, Banglalink, Robi, Airtel, Teletalk
- ✅ **Live Validation** - Real-time validation that starts after sufficient digits
- ✅ **Smart Error Handling** - No errors on empty input
- ✅ **Raw Numeric Input** - No forced formatting during typing
- ✅ **React Hook + Component** - Ready-to-use hooks and components
- ✅ **Tailwind-Friendly** - Fully customizable with Tailwind classes
- ✅ **React Hook Form Integration** - Seamless integration with form libraries
- ✅ **TypeScript Support** - Full type safety
- ✅ **Zero Config CSS** - Styles load automatically

---

## 📦 Installation

```bash
npm i bd-number-validator
```

Or using Yarn:

```bash
yarn add bd-number-validator
```

---

## 🧠 1. Core Validator Usage

### Basic Validation

```javascript
import { validatePhoneNumber } from "bd-number-validator";

const result = validatePhoneNumber("01781131905");

console.log(result);
/*
{
  isValid: true,
  normalized: "+8801781131905",
  operator: "Grameenphone"
}
*/
```

### Pre-Submit Validation

```javascript
const result = validatePhoneNumber(phone);

if (!result.isValid) {
  console.error(result.error);
  return;
}

// Submit using normalized number
api.post("/signup", { phone: result.normalized });
```

### Auto-Clean During Typing

```javascript
validatePhoneNumber(" 017 8113-1905 ");
// Automatically removes spaces and special characters
```

### Shorthand Format Support

| Input            | Auto-Fixed Output |
| ---------------- | ----------------- |
| `1781131905`     | `01781131905`     |
| `8801781131905`  | `01781131905`     |
| `+8801781131905` | normalized format |

---

## ⚛️ 2. React Hook Usage (`useBDPhone`)

```javascript
import { useBDPhone } from "bd-number-validator";

export default function App() {
  const { raw, onChange, error, normalized, operator, isValid } =
    useBDPhone("");

  return (
    <div>
      <input
        value={raw}
        placeholder="Enter phone number"
        onChange={(e) => onChange(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {isValid && normalized && (
        <>
          <p>Normalized: {normalized}</p>
          <p>Operator: {operator}</p>
        </>
      )}
    </div>
  );
}
```

---

## 🎨 3. React Component — `<BDPhoneInput />`

### Basic Example

```javascript
import { BDPhoneInput } from "bd-number-validator";

export default function Demo() {
  return <BDPhoneInput onValueChange={(val) => console.log(val)} />;
}
```

### Custom Error UI

```javascript
<BDPhoneInput
  customError={(msg) => <div className="text-red-600 font-bold">⚠ {msg}</div>}
/>
```

### Full Tailwind Customization

```javascript
<BDPhoneInput
  label="Phone Number"
  wrapperClass="flex flex-col gap-2"
  inputBoxClass="border p-3 rounded-lg shadow-sm"
  inputClass="text-gray-900 flex-1"
  labelClass="text-sm font-medium"
  showError={true}
  onValueChange={(v) => console.log(v)}
/>
```

---

## 📚 4. API Reference

### `validatePhoneNumber(phone: string)`

**Returns:**

| Field        | Type                    | Description                    |
| ------------ | ----------------------- | ------------------------------ |
| `isValid`    | `boolean`               | Phone number validity          |
| `error`      | `string \| undefined`   | Error message if invalid       |
| `normalized` | `string \| undefined`   | `+8801XXXXXXXXX` format        |
| `operator`   | `Operator \| undefined` | GP, BL, Robi, Airtel, Teletalk |

---

### `useBDPhone(initialValue: string)`

**Returns:**

| Field        | Type                      | Description               |
| ------------ | ------------------------- | ------------------------- |
| `raw`        | `string`                  | Current input value       |
| `error`      | `string \| undefined`     | Validation error          |
| `normalized` | `string \| undefined`     | Normalized BD format      |
| `operator`   | `Operator \| undefined`   | Operator name             |
| `isValid`    | `boolean`                 | `true` if number is valid |
| `onChange`   | `(value: string) => void` | Pass to input onChange    |

---

### `<BDPhoneInput />` Props

| Prop            | Type                   | Default | Description               |
| --------------- | ---------------------- | ------- | ------------------------- |
| `value`         | `string`               | —       | Controlled value          |
| `onValueChange` | `(v?: string) => void` | —       | Returns normalized number |
| `label`         | `string`               | `""`    | Input label               |
| `showError`     | `boolean`              | `true`  | Toggle error visibility   |
| `wrapperClass`  | `string`               | —       | Wrapper CSS class         |
| `inputBoxClass` | `string`               | —       | Input box CSS class       |
| `inputClass`    | `string`               | —       | Input CSS class           |
| `labelClass`    | `string`               | —       | Label CSS class           |
| `customError`   | `(msg) => ReactNode`   | —       | Custom error renderer     |

---

## 📡 5. Operator Detection Table

| Operator     | Prefix   |
| ------------ | -------- |
| Grameenphone | 017, 013 |
| Banglalink   | 019, 014 |
| Robi         | 018      |
| Airtel       | 016      |
| Teletalk     | 015      |

---

## 🧪 6. Example Outputs

### ✅ Valid Example

```json
{
  "isValid": true,
  "normalized": "+8801781131905",
  "operator": "Grameenphone"
}
```

### ❌ Invalid Operator

```json
{
  "isValid": false,
  "error": "Invalid operator prefix"
}
```

### ❌ Invalid Format

```json
{
  "isValid": false,
  "error": "Invalid number format"
}
```

---

## 🔧 7. React Hook Form Integration

### ✅ Method A: With Controller (Recommended)

```javascript
import { Controller, useForm } from "react-hook-form";
import { BDPhoneInput, validatePhoneNumber } from "bd-number-validator";

export default function Form() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (values) => console.log(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="phone"
        control={control}
        rules={{
          validate: (v) => {
            const r = validatePhoneNumber(v || "");
            return r.isValid || r.error;
          },
        }}
        render={({ field, fieldState }) => (
          <BDPhoneInput
            value={field.value}
            onValueChange={field.onChange}
            showError={!!fieldState.error}
            customError={() => (
              <span className="text-red-600">{fieldState.error?.message}</span>
            )}
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### ✅ Method B: Without Controller (Simplest)

```javascript
import { useForm } from "react-hook-form";
import { BDPhoneInput, validatePhoneNumber } from "bd-number-validator";

export default function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    const result = validatePhoneNumber(data.phone);
    console.log("Final normalized:", result.normalized);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <BDPhoneInput
        value={getValues("phone")}
        onValueChange={(v) => setValue("phone", v ?? "")}
        showError={!!errors.phone}
        customError={() => (
          <span className="text-red-600">{errors.phone?.message}</span>
        )}
      />

      <input
        type="hidden"
        {...register("phone", {
          validate: (v) => {
            const r = validatePhoneNumber(v || "");
            return r.isValid || r.error;
          },
        })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 📄 License

MIT © Muhammad Rashed

---

## 🤝 Contributing

Pull requests, issues, and feedback are welcome!

**GitHub Repository:** [https://github.com/mrashed21/bd-number-validator](https://github.com/mrashed21/bd-number-validator)

---

## 📧 Support

For support and inquiries, contact: **rashedjaman@gmail.com**

---

## 🌟 Show Your Support

If you find this package helpful, please consider giving it a ⭐ on [GitHub](https://github.com/mrashed21/bd-number-validator)!
