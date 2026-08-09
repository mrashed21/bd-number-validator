import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PhoneInputBd } from "./phone-input-bd";
import type { PhoneChangeDetails } from "./types";

afterEach(cleanup);

const field = () => screen.getByRole("textbox") as HTMLInputElement;

/** Last recorded call of a mocked `onChange`. */
function lastCall<T extends unknown[]>(mock: { mock: { calls: T[] } }): T {
  return mock.mock.calls[mock.mock.calls.length - 1];
}

/**
 * Simulate typing/pasting `value` with the caret left at `caret`.
 *
 * The value must go through `fireEvent` so React's value tracker sees a real
 * change; assigning `input.value` directly would suppress the change event.
 */
function typeInto(input: HTMLInputElement, value: string, caret?: number) {
  input.focus();
  fireEvent.change(input, {
    target: caret === undefined ? { value } : { value, selectionStart: caret },
  });
}

describe("PhoneInputBd — rendering", () => {
  it("renders without any stylesheet import", () => {
    render(<PhoneInputBd />);
    expect(field()).toBeDefined();
    expect(field().getAttribute("type")).toBe("tel");
    expect(field().getAttribute("placeholder")).toBe("017 8113 1905");
  });

  it("renders the flag and the +880 prefix by default", () => {
    const { container } = render(<PhoneInputBd />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("svg title")?.textContent).toBe(
      "Bangladesh",
    );
    expect(screen.getByText("+880")).toBeDefined();
  });

  it("hides the flag and prefix when they are set to null", () => {
    const { container } = render(<PhoneInputBd flag={null} prefix={null} />);
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.queryByText("+880")).toBeNull();
  });

  it("accepts custom flag and prefix nodes", () => {
    render(<PhoneInputBd flag={<span>BD</span>} prefix={<b>00880</b>} />);
    expect(screen.getByText("BD")).toBeDefined();
    expect(screen.getByText("00880")).toBeDefined();
  });

  it("renders no label unless one is given", () => {
    const { container, rerender } = render(<PhoneInputBd />);
    expect(container.querySelector("label")).toBeNull();

    rerender(<PhoneInputBd label="Mobile number" />);
    expect(container.querySelector("label")?.textContent).toBe("Mobile number");
  });
});

describe("PhoneInputBd — formatting", () => {
  it("formats digits as they are entered", () => {
    render(<PhoneInputBd />);
    typeInto(field(), "0178113");
    expect(field().value).toBe("017 8113");

    typeInto(field(), "017 81131905");
    expect(field().value).toBe("017 8113 1905");
  });

  it("strips a pasted country code", () => {
    render(<PhoneInputBd />);
    typeInto(field(), "+8801781131905");
    expect(field().value).toBe("017 8113 1905");
  });

  it("refuses a twelfth digit and keeps the field in sync", () => {
    render(<PhoneInputBd />);
    typeInto(field(), "01781131905");
    expect(field().value).toBe("017 8113 1905");

    typeInto(field(), "017 8113 19055");
    expect(field().value).toBe("017 8113 1905");
  });

  it("clears back to empty", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    typeInto(field(), "");
    expect(field().value).toBe("");
  });
});

describe("PhoneInputBd — caret preservation", () => {
  it("keeps the caret after the digit just typed in the middle", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    const input = field();
    expect(input.value).toBe("017 8113 1905");

    // Insert "9" right after "017 " (caret index 4 → 5).
    typeInto(input, "017 98113 1905", 5);

    expect(input.value).toBe("017 9811 3190");
    expect(input.selectionStart).toBe(5);
  });

  it("keeps the caret when deleting from the middle", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    const input = field();

    // Backspace the "8" at index 4 → text "017 113 1905", caret 4.
    typeInto(input, "017 113 1905", 4);

    // Three digits precede the caret, so it lands right after "017".
    expect(input.value).toBe("017 1131 905");
    expect(input.selectionStart).toBe(3);
  });

  it("puts the caret at the end when backspacing the last digit", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    const input = field();

    typeInto(input, "017 8113 190");

    expect(input.value).toBe("017 8113 190");
    expect(input.selectionStart).toBe(12);
  });

  it("keeps the caret at the start when the field is emptied", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    const input = field();

    typeInto(input, "", 0);

    expect(input.value).toBe("");
    expect(input.selectionStart).toBe(0);
  });

  it("does not move the caret on an unrelated re-render", () => {
    function Wrapper() {
      const [, setTick] = useState(0);
      return (
        <>
          <PhoneInputBd defaultValue="01781131905" />
          <button onClick={() => setTick((t) => t + 1)}>tick</button>
        </>
      );
    }
    render(<Wrapper />);
    const input = field();
    input.focus();
    input.setSelectionRange(2, 2);

    fireEvent.click(screen.getByRole("button"));

    expect(input.selectionStart).toBe(2);
  });
});

describe("PhoneInputBd — controlled and uncontrolled", () => {
  it("supports uncontrolled usage with defaultValue", () => {
    render(<PhoneInputBd defaultValue="+8801781131905" />);
    expect(field().value).toBe("017 8113 1905");
  });

  it("follows external value changes", () => {
    function Wrapper() {
      const [value, setValue] = useState("01781131905");
      return (
        <>
          <PhoneInputBd value={value} onChange={setValue} />
          <button onClick={() => setValue("01911111111")}>replace</button>
        </>
      );
    }
    render(<Wrapper />);
    expect(field().value).toBe("017 8113 1905");

    fireEvent.click(screen.getByRole("button", { name: "replace" }));
    expect(field().value).toBe("019 1111 1111");
  });

  it("round-trips through a parent state setter", () => {
    function Wrapper() {
      const [value, setValue] = useState("");
      return (
        <>
          <PhoneInputBd value={value} onChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    const { container } = render(<Wrapper />);
    typeInto(field(), "017 8113 1905");

    expect(field().value).toBe("017 8113 1905");
    expect(container.querySelector("output")?.textContent).toBe("01781131905");
  });

  it("does not change a frozen controlled value", () => {
    render(<PhoneInputBd value="01781131905" onChange={() => {}} />);
    typeInto(field(), "019");
    expect(field().value).toBe("017 8113 1905");
  });
});

describe("PhoneInputBd — onChange contract", () => {
  it("reports digits first and validation details second", () => {
    const onChange =
      vi.fn<(value: string, details: PhoneChangeDetails) => void>();
    render(<PhoneInputBd onChange={onChange} />);

    typeInto(field(), "017 8113 1905");

    const [value, details] = lastCall(onChange);
    expect(value).toBe("01781131905");
    expect(details.formatted).toBe("017 8113 1905");
    expect(details.normalized).toBe("+8801781131905");
    expect(details.operator).toBe("Grameenphone");
    expect(details.isValid).toBe(true);
  });

  it("reports undefined normalized while the number is incomplete", () => {
    const onChange =
      vi.fn<(value: string, details: PhoneChangeDetails) => void>();
    render(<PhoneInputBd onChange={onChange} />);

    typeInto(field(), "01781");

    const [, details] = lastCall(onChange);
    expect(details.normalized).toBeUndefined();
    expect(details.code).toBe("INCOMPLETE");
  });
});

describe("PhoneInputBd — errors", () => {
  it("shows the built-in message for an unknown operator", () => {
    render(<PhoneInputBd defaultValue="012" />);
    expect(screen.getByRole("alert").textContent).toBe("Invalid operator");
  });

  it("renders the error below the input wrapper", () => {
    const { container } = render(<PhoneInputBd defaultValue="012" />);
    const input = field();
    const alert = screen.getByRole("alert");

    expect(input.parentElement?.contains(alert)).toBe(false);
    expect(container.firstElementChild?.lastElementChild).toBe(alert);
  });

  it("stays quiet while the first digits are typed", () => {
    render(<PhoneInputBd />);
    typeInto(field(), "01");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("stays quiet for a complete valid number", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("can suppress the built-in message", () => {
    render(<PhoneInputBd defaultValue="012" showError={false} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("lets an external error replace the built-in one", () => {
    render(<PhoneInputBd defaultValue="012" error="Phone is required" />);
    expect(screen.getByRole("alert").textContent).toBe("Phone is required");
  });

  it("treats error={null} as no error", () => {
    render(<PhoneInputBd defaultValue="012" error={null} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("PhoneInputBd — accessibility", () => {
  it("connects the label to the input", () => {
    const { container } = render(<PhoneInputBd label="Mobile number" />);
    const label = container.querySelector("label")!;
    expect(label.getAttribute("for")).toBe(field().id);
    expect(field().id).toBeTruthy();
  });

  it("honors an explicit id", () => {
    const { container } = render(<PhoneInputBd id="phone" label="Phone" />);
    expect(field().id).toBe("phone");
    expect(container.querySelector("label")?.getAttribute("for")).toBe("phone");
  });

  it("marks the input invalid and describes it with the error", () => {
    render(<PhoneInputBd defaultValue="012" label="Phone" />);
    const alert = screen.getByRole("alert");
    expect(field().getAttribute("aria-invalid")).toBe("true");
    expect(field().getAttribute("aria-describedby")).toBe(alert.id);
  });

  it("keeps a caller-supplied aria-describedby alongside the error id", () => {
    render(
      <PhoneInputBd defaultValue="012" aria-describedby="hint" label="Phone" />,
    );
    const describedBy = field().getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toContain("hint");
    expect(describedBy.split(" ")).toContain(screen.getByRole("alert").id);
  });

  it("drops aria-invalid when there is no error", () => {
    render(<PhoneInputBd defaultValue="01781131905" />);
    expect(field().getAttribute("aria-invalid")).toBeNull();
  });

  it("sets numeric input mode and tel autocomplete by default", () => {
    render(<PhoneInputBd />);
    expect(field().getAttribute("inputmode")).toBe("numeric");
    expect(field().getAttribute("autocomplete")).toBe("tel");
  });

  it("forwards native input attributes", () => {
    render(
      <PhoneInputBd
        name="phone"
        required
        readOnly
        disabled
        autoComplete="off"
        inputMode="tel"
        data-testid="native"
      />,
    );
    const input = field();
    expect(input.getAttribute("name")).toBe("phone");
    expect(input.required).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(input.getAttribute("inputmode")).toBe("tel");
    expect(input.getAttribute("data-testid")).toBe("native");
  });

  it("forwards a ref to the underlying input", () => {
    let node: HTMLInputElement | null = null;
    function Wrapper() {
      const ref = useRef<HTMLInputElement>(null);
      return (
        <>
          <PhoneInputBd ref={ref} />
          <button
            onClick={() => {
              node = ref.current;
            }}
          >
            read
          </button>
        </>
      );
    }
    render(<Wrapper />);
    fireEvent.click(screen.getByRole("button"));
    expect(node).toBe(field());
  });

  it("calls onFocus and onBlur", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(<PhoneInputBd onFocus={onFocus} onBlur={onBlur} />);

    fireEvent.focus(field());
    fireEvent.blur(field());

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});

describe("PhoneInputBd — styling", () => {
  it("applies built-in styles so no CSS import is needed", () => {
    render(<PhoneInputBd />);
    expect(field().style.background).toBe("transparent");
  });

  it("merges per-slot style overrides over the defaults", () => {
    render(<PhoneInputBd styles={{ input: { fontSize: "22px" } }} />);
    expect(field().style.fontSize).toBe("22px");
    expect(field().style.background).toBe("transparent");
  });

  it("supports state-aware style functions", () => {
    const { container } = render(
      <PhoneInputBd
        defaultValue="012"
        classNames={{ inputWrapper: "wrap" }}
        styles={{
          inputWrapper: ({ hasError }) => ({
            borderColor: hasError ? "rgb(255, 0, 0)" : "rgb(0, 0, 255)",
          }),
        }}
      />,
    );
    const wrapper = container.querySelector(".wrap") as HTMLElement;
    expect(wrapper.style.borderColor).toBe("rgb(255, 0, 0)");
  });

  it("removes every built-in style when unstyled", () => {
    render(<PhoneInputBd unstyled />);
    expect(field().style.background).toBe("");
    expect(field().style.border).toBe("");
  });

  it("applies className to the container and classNames per slot", () => {
    const { container } = render(
      <PhoneInputBd
        label="Phone"
        defaultValue="012"
        className="outer"
        classNames={{
          container: "container",
          label: "label",
          inputWrapper: "wrapper",
          flag: "flag",
          prefix: "prefix",
          input: "input",
          error: "error",
        }}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toBe("outer container");
    expect(container.querySelector("label")?.className).toBe("label");
    expect(container.querySelector(".wrapper")).not.toBeNull();
    expect(container.querySelector("svg")?.getAttribute("class")).toBe("flag");
    expect(screen.getByText("+880").className).toBe("prefix");
    expect(field().className).toBe("input");
    expect(screen.getByRole("alert").className).toBe("error");
  });
});
