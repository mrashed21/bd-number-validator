import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { useState, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { validatePhoneNumber } from "../core/validate-phone-number";
import { PhoneInputBd } from "./phone-input-bd";
import { useBdPhone } from "./use-bd-phone";

afterEach(cleanup);

const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf8")
) as Record<string, Record<string, string> | undefined>;

const field = () => screen.getByRole("textbox") as HTMLInputElement;

describe("no form library is a dependency", () => {
  it.each(["dependencies", "peerDependencies", "bundledDependencies"])(
    "does not list react-hook-form in %s",
    (section) => {
      expect(packageJson[section]?.["react-hook-form"]).toBeUndefined();
    }
  );

  it("declares no runtime dependencies at all", () => {
    expect(packageJson.dependencies).toBeUndefined();
  });

  it("keeps react as the only, optional peer dependency", () => {
    expect(Object.keys(packageJson.peerDependencies ?? {})).toEqual(["react"]);
    expect(packageJson.peerDependenciesMeta?.react).toEqual({ optional: true });
  });

  it("is not installed in this workspace either", () => {
    expect(
      packageJson.devDependencies?.["react-hook-form"]
    ).toBeUndefined();
  });
});

/**
 * A stand-in with the same shape as React Hook Form's `Controller` render prop.
 * It proves the component works with any `{ value, onChange }` field object
 * without the library being present.
 */
function FieldController({
  defaultValue = "",
  children,
}: {
  defaultValue?: string;
  children: (field: {
    value: string;
    onChange: (value: string) => void;
  }) => ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <>
      {children({ value, onChange: setValue })}
      <output>{value}</output>
    </>
  );
}

describe("form library compatibility", () => {
  it("works with a Controller-style render prop", () => {
    const { container } = render(
      <FieldController>
        {(field) => (
          <PhoneInputBd value={field.value} onChange={field.onChange} />
        )}
      </FieldController>
    );

    fireEvent.change(field(), { target: { value: "01781131905" } });

    expect(field().value).toBe("017 8113 1905");
    expect(container.querySelector("output")?.textContent).toBe("01781131905");
  });

  it("validates externally with validatePhoneNumber, as a resolver would", () => {
    const rule = (value: string) => {
      const result = validatePhoneNumber(value, { strict: true });
      return result.normalized ?? result.error ?? "Invalid phone number";
    };

    expect(rule("01781131905")).toBe("+8801781131905");
    expect(rule("")).toBe("Phone number is required");
    expect(rule("01211111111")).toBe("Invalid operator");
  });

  it("surfaces an external error through the error prop", () => {
    render(<PhoneInputBd defaultValue="01781131905" error="Already registered" />);
    expect(screen.getByRole("alert").textContent).toBe("Already registered");
    expect(field().getAttribute("aria-invalid")).toBe("true");
  });

  it("works inside a native form with a plain submit handler", () => {
    const submitted: string[] = [];

    function NativeForm() {
      const [phone, setPhone] = useState("");
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const result = validatePhoneNumber(phone, { strict: true });
            submitted.push(result.normalized ?? `error:${result.code}`);
          }}
        >
          <PhoneInputBd name="phone" value={phone} onChange={setPhone} />
          <button type="submit">Submit</button>
        </form>
      );
    }

    render(<NativeForm />);
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    fireEvent.change(field(), { target: { value: "01781131905" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(submitted).toEqual(["error:EMPTY", "+8801781131905"]);
  });

  it("supports a fully custom UI built on the headless hook", () => {
    function CustomInput() {
      const phone = useBdPhone({ defaultValue: "0178113" });
      return (
        <div>
          <input
            aria-label="Custom phone"
            value={phone.formatted}
            onChange={(event) => phone.onChange(event.target.value)}
          />
          <span data-testid="operator">{phone.operator}</span>
          <span data-testid="normalized">{phone.normalized ?? "—"}</span>
        </div>
      );
    }

    render(<CustomInput />);
    const input = screen.getByLabelText("Custom phone") as HTMLInputElement;

    expect(input.value).toBe("017 8113");
    expect(screen.getByTestId("operator").textContent).toBe("Grameenphone");
    expect(screen.getByTestId("normalized").textContent).toBe("—");

    fireEvent.change(input, { target: { value: "017 8113 1905" } });

    expect(screen.getByTestId("normalized").textContent).toBe("+8801781131905");
  });
});
