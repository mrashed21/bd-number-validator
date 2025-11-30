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
- ✅ **Smart Cursor Positioning** - Maintains cursor position during formatting
- ✅ **Auto-formatting UI** - Displays as `1XX XXXX XXXX` while typing
- ✅ **Bangladesh Flag Icon** - Built-in SVG flag component
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

### Features

- **Bangladesh Flag**: Built-in SVG flag icon
- **Auto-formatting**: Displays as `1XX XXXX XXXX` format
- **Smart Cursor**: Maintains cursor position during typing
- **Validation**: Shows errors after 3+ digits entered
- **Customizable**: All parts can be styled or replaced

### With Label

```javascript
<BDPhoneInput
  label="Phone Number"
  showLabel={true}
  onValueChange={(val) => console.log(val)}
/>
```

### Custom Error UI

```javascript
<BDPhoneInput
  renderError={(msg) => <div className="text-red-600 font-bold">⚠ {msg}</div>}
/>
```

### Custom Flag

```javascript
<BDPhoneInput
  renderFlag={() => <img src="/bd-flag.png" alt="BD" className="w-6 h-4" />}
/>
```

### Full Tailwind Customization

```javascript
<BDPhoneInput
  label="Mobile Number"
  showLabel={true}
  containerClass="mb-4"
  labelClass="block text-sm font-medium text-gray-700 mb-2"
  wrapperClass="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500"
  flagClass="w-6 h-4"
  prefixClass="text-gray-600 font-medium"
  inputClass="flex-1 outline-none text-gray-900"
  errorClass="text-sm text-red-600 mt-1"
  showError={true}
  onValueChange={(v) => console.log(v)}
/>
```

### Custom Label Renderer

```javascript
<BDPhoneInput
  label="Phone Number"
  renderLabel={(label) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="font-semibold">{label}</span>
      <span className="text-xs text-gray-500">(Required)</span>
    </div>
  )}
/>
```

### Custom Prefix

```javascript
<BDPhoneInput
  renderPrefix={() => <span className="text-blue-600 font-bold">+880</span>}
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

#### Value & Change Handling

| Prop            | Type                   | Default | Description               |
| --------------- | ---------------------- | ------- | ------------------------- |
| `value`         | `string`               | —       | Controlled value          |
| `onValueChange` | `(v?: string) => void` | —       | Returns normalized number |

#### Label Props

| Prop          | Type                           | Default          | Description           |
| ------------- | ------------------------------ | ---------------- | --------------------- |
| `label`       | `string`                       | `"Phone Number"` | Input label text      |
| `showLabel`   | `boolean`                      | `true`           | Show/hide label       |
| `labelClass`  | `string`                       | `""`             | Label CSS class       |
| `renderLabel` | `(label: string) => ReactNode` | —                | Custom label renderer |

#### Styling Props

| Prop             | Type     | Default | Description           |
| ---------------- | -------- | ------- | --------------------- |
| `containerClass` | `string` | `""`    | Outer container class |
| `wrapperClass`   | `string` | `""`    | Input wrapper class   |
| `flagClass`      | `string` | `""`    | Flag icon class       |
| `prefixClass`    | `string` | `""`    | +880 prefix class     |
| `inputClass`     | `string` | `""`    | Input field class     |
| `errorClass`     | `string` | `""`    | Error message class   |

#### Custom Renderers

| Prop           | Type                           | Default | Description               |
| -------------- | ------------------------------ | ------- | ------------------------- |
| `renderFlag`   | `() => ReactNode`              | —       | Custom flag component     |
| `renderPrefix` | `() => ReactNode`              | —       | Custom prefix (e.g. +880) |
| `renderError`  | `(error: string) => ReactNode` | —       | Custom error renderer     |

#### Error Display

| Prop        | Type      | Default | Description             |
| ----------- | --------- | ------- | ----------------------- |
| `showError` | `boolean` | `true`  | Toggle error visibility |

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

### ✅ Empty Input (Valid)

```json
{
  "isValid": true
}
```

### ✅ Partial Input (Valid until 3 digits)

```json
{
  "isValid": true,
  "operator": "Grameenphone"
}
```

### ❌ Invalid Operator

```json
{
  "isValid": false,
  "error": "Invalid operator"
}
```

### ❌ Invalid Length

```json
{
  "isValid": false,
  "error": "Invalid number"
}
```

---

## 🎯 7. Formatting Behavior

### UI Formatting (`formatBDPhoneUI`)

The input automatically formats digits as you type:

| Raw Input     | Displayed As    |
| ------------- | --------------- |
| `017`         | `017`           |
| `0178`        | `017 8`         |
| `01781`       | `017 81`        |
| `017811`      | `017 811`       |
| `0178113`     | `017 8113`      |
| `01781131`    | `017 8113 1`    |
| `017811319`   | `017 8113 19`   |
| `0178113190`  | `017 8113 190`  |
| `01781131905` | `017 8113 1905` |

**Note:** Formatting is only for display. The actual value stored is numeric only.

---

## 🔧 8. React Hook Form Integration

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
            return r.isValid || r.error || "Invalid phone number";
          },
        }}
        render={({ field, fieldState }) => (
          <BDPhoneInput
            value={field.value}
            onValueChange={field.onChange}
            showError={!!fieldState.error}
            renderError={() => (
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
        renderError={() => (
          <span className="text-red-600">{errors.phone?.message}</span>
        )}
      />

      <input
        type="hidden"
        {...register("phone", {
          validate: (v) => {
            const r = validatePhoneNumber(v || "");
            return r.isValid || r.error || "Invalid phone number";
          },
        })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🎨 9. Styling Examples

### Example 1: Modern Card Style

```javascript
<BDPhoneInput
  containerClass="max-w-md"
  labelClass="block text-sm font-semibold text-gray-800 mb-2"
  wrapperClass="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all"
  flagClass="w-7 h-5 rounded"
  prefixClass="text-gray-700 font-semibold text-base"
  inputClass="flex-1 outline-none text-gray-900 text-base placeholder-gray-400"
  errorClass="text-sm text-red-500 mt-2 ml-1"
/>
```

### Example 2: Minimal Style

```javascript
<BDPhoneInput
  showLabel={false}
  wrapperClass="flex items-center gap-2 border-b-2 border-gray-300 pb-2 focus-within:border-blue-500 transition-colors"
  flagClass="w-6 h-4"
  prefixClass="text-gray-500"
  inputClass="flex-1 outline-none bg-transparent"
  errorClass="text-xs text-red-500 mt-1"
/>
```

### Example 3: Dark Mode

```javascript
<BDPhoneInput
  containerClass="bg-gray-900 p-6 rounded-lg"
  labelClass="text-gray-300 text-sm mb-2 block"
  wrapperClass="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50"
  flagClass="w-6 h-4"
  prefixClass="text-gray-400 font-medium"
  inputClass="flex-1 outline-none bg-transparent text-white placeholder-gray-500"
  errorClass="text-sm text-red-400 mt-2"
/>
```

---

## 💡 10. Advanced Usage

### Controlled Component with External State

```javascript
import { useState } from "react";
import { BDPhoneInput } from "bd-number-validator";

export default function App() {
  const [phone, setPhone] = useState("");

  return (
    <div>
      <BDPhoneInput value={phone} onValueChange={setPhone} />

      <button onClick={() => console.log(phone)}>Submit: {phone}</button>
    </div>
  );
}
```

### Multiple Phone Inputs

```javascript
export default function App() {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");

  return (
    <div>
      <BDPhoneInput
        label="Primary Phone"
        value={primary}
        onValueChange={setPrimary}
      />

      <BDPhoneInput
        label="Secondary Phone"
        value={secondary}
        onValueChange={setSecondary}
      />
    </div>
  );
}
```

---

## 🚀 11. TypeScript Support

All components and functions are fully typed:

```typescript
import {
  BDPhoneInput,
  useBDPhone,
  validatePhoneNumber,
  PhoneValidationResult,
} from "bd-number-validator";

const result: PhoneValidationResult = validatePhoneNumber("01781131905");

const MyComponent = () => {
  const { raw, isValid, normalized } = useBDPhone("");

  return <BDPhoneInput onValueChange={(v?: string) => console.log(v)} />;
};
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
