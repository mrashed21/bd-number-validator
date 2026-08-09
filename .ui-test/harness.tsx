import React from "react";
import { createRoot } from "react-dom/client";
import { BdFlag, PhoneInputBd } from "../src/react/index";

function Case({
  title,
  children,
  width,
}: {
  title: string;
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div className="col" style={width ? { width } : undefined}>
      <div className="caption">{title}</div>
      {children}
    </div>
  );
}

/** A genuine shadcn/ui form field, built from the utility values verbatim. */
function ShadcnField({
  label,
  value,
  message,
  disabled,
  placeholder,
}: {
  label: string;
  value?: string;
  message?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="form-item">
      <label className="label" data-error={message ? "true" : undefined}>
        {label}
      </label>
      <input
        className="input"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={message ? true : undefined}
        readOnly
      />
      {message ? <p className="message">{message}</p> : null}
    </div>
  );
}

function App() {
  return (
    <div className="cols">
      <Case title="A. shadcn Input (reference)">
        <div className="card">
          <div className="card-title">Contact</div>
          <div className="card-desc">Rendered from shadcn utility values.</div>
          <div className="stack">
            <ShadcnField label="Email" value="rashed@example.com" />
            <ShadcnField label="Full name" placeholder="Muhammad Rashed" />
            <ShadcnField
              label="Username"
              value="mr"
              message="Username must be at least 3 characters."
            />
            <ShadcnField label="Country" value="Bangladesh" disabled />
          </div>
        </div>
      </Case>

      <Case title="B. PhoneInputBd (this package)">
        <div className="card">
          <div className="card-title">Contact</div>
          <div className="card-desc">Rendered from the built-in defaults.</div>
          <div className="stack">
            <PhoneInputBd label="Mobile number" defaultValue="01781131905" />
            <PhoneInputBd label="Backup number" defaultValue="" />
            <PhoneInputBd label="Office number" defaultValue="012" />
            <PhoneInputBd
              label="Verified number"
              defaultValue="01781131905"
              disabled
            />
          </div>
        </div>
      </Case>

      <Case title="C. mixed in one shadcn form">
        <div className="card">
          <div className="card-title">Create account</div>
          <div className="card-desc">
            shadcn fields and PhoneInputBd interleaved.
          </div>
          <div className="stack">
            <ShadcnField label="Email" value="rashed@example.com" />
            <PhoneInputBd label="Mobile number" defaultValue="01781131905" />
            <ShadcnField label="Password" value="hunter2hunter2" />
            <div className="row">
              <PhoneInputBd defaultValue="01781131905" />
              <button className="button">Send OTP</button>
            </div>
          </div>
        </div>
      </Case>

      <Case title="D. flag size candidates">
        <div className="card">
          <div className="stack">
            <PhoneInputBd
              label="30 x 18 (previous default)"
              defaultValue="01781131905"
              flag={<BdFlag width={30} height={18} title="Bangladesh" />}
            />
            <PhoneInputBd
              label="25 x 15"
              defaultValue="01781131905"
              flag={<BdFlag width={25} height={15} title="Bangladesh" />}
            />
            <PhoneInputBd
              label="20 x 12"
              defaultValue="01781131905"
              flag={<BdFlag width={20} height={12} title="Bangladesh" />}
            />
            <PhoneInputBd
              label="current default"
              defaultValue="01781131905"
            />
          </div>
        </div>
      </Case>

      <Case title="E. dark (shadcn dark tokens)">
        <div
          className="card"
          style={
            {
              background: "#0a0a0a",
              borderColor: "#262626",
              color: "#fafafa",
              ["--phone-input-bd-bg" as any]: "rgba(38, 38, 38, 0.3)",
              ["--phone-input-bd-color" as any]: "#fafafa",
              ["--phone-input-bd-border" as any]: "#262626",
              ["--phone-input-bd-border-focus" as any]: "#737373",
              ["--phone-input-bd-ring" as any]: "rgba(115, 115, 115, 0.5)",
              ["--phone-input-bd-label-color" as any]: "#fafafa",
              ["--phone-input-bd-prefix-color" as any]: "#a1a1a1",
              ["--phone-input-bd-error-color" as any]: "#ff6467",
              ["--phone-input-bd-border-error" as any]: "#ff6467",
              ["--phone-input-bd-ring-error" as any]: "rgba(255,100,103,0.4)",
            } as any
          }
        >
          <div className="card-title">Contact</div>
          <div className="stack" style={{ marginTop: 16 }}>
            <PhoneInputBd label="Mobile number" defaultValue="01781131905" />
            <PhoneInputBd label="Office number" defaultValue="012" />
          </div>
        </div>
      </Case>

      <Case title="F. focus / error / long message">
        <div className="card">
          <div className="stack">
            <PhoneInputBd label="Focused (see next shot)" defaultValue="0178" />
            <PhoneInputBd
              label="Mobile number"
              defaultValue="01781131905"
              error="This phone number is already registered with another account."
            />
            <PhoneInputBd
              label="No prefix, no flag"
              defaultValue="01781131905"
              flag={null}
              prefix={null}
            />
          </div>
        </div>
      </Case>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
