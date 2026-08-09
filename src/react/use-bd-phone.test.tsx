import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useBdPhone } from "./use-bd-phone";
import type { PhoneChangeDetails, UseBdPhoneOptions } from "./types";

afterEach(cleanup);

/** Renders the hook and exposes its latest return value. */
function renderHook(options: UseBdPhoneOptions = {}) {
  const result = { current: undefined as ReturnType<typeof useBdPhone> | undefined };

  function Probe(props: UseBdPhoneOptions) {
    result.current = useBdPhone(props);
    return null;
  }

  const view = render(<Probe {...options} />);
  return {
    result: result as { current: ReturnType<typeof useBdPhone> },
    rerender: (next: UseBdPhoneOptions) => view.rerender(<Probe {...next} />),
  };
}

describe("useBdPhone — uncontrolled", () => {
  it("starts empty", () => {
    const { result } = renderHook();
    expect(result.current.raw).toBe("");
    expect(result.current.formatted).toBe("");
    expect(result.current.isValid).toBe(true);
    expect(result.current.isComplete).toBe(false);
  });

  it("seeds from defaultValue and accepts any input shape", () => {
    const { result } = renderHook({ defaultValue: "+880 17-8113 1905" });
    expect(result.current.raw).toBe("01781131905");
    expect(result.current.formatted).toBe("017 8113 1905");
    expect(result.current.normalized).toBe("+8801781131905");
    expect(result.current.isComplete).toBe(true);
  });

  it("sanitizes on change and keeps its own state", () => {
    const { result } = renderHook();
    act(() => result.current.onChange("017-8113 1905"));
    expect(result.current.raw).toBe("01781131905");
    expect(result.current.operator).toBe("Grameenphone");
    expect(result.current.normalized).toBe("+8801781131905");
  });

  it("exposes the error while the number is incomplete", () => {
    const { result } = renderHook();
    act(() => result.current.onChange("01781"));
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBe("Invalid number");
    expect(result.current.code).toBe("INCOMPLETE");
    expect(result.current.normalized).toBeUndefined();
  });

  it("resets", () => {
    const { result } = renderHook({ defaultValue: "01781131905" });
    act(() => result.current.reset());
    expect(result.current.raw).toBe("");
    expect(result.current.isComplete).toBe(false);
  });

  it("ignores defaultValue changes after mount", () => {
    const { result, rerender } = renderHook({ defaultValue: "01781131905" });
    rerender({ defaultValue: "01911111111" });
    expect(result.current.raw).toBe("01781131905");
  });
});

describe("useBdPhone — controlled", () => {
  it("renders the value it is given and does not self-update", () => {
    const onChange = vi.fn();
    const { result } = renderHook({ value: "01781131905", onChange });

    act(() => result.current.onChange("01911111111"));

    expect(onChange).toHaveBeenCalledWith("01911111111", expect.any(Object));
    expect(result.current.raw).toBe("01781131905");
  });

  it("follows external value updates", () => {
    const { result, rerender } = renderHook({ value: "01781131905" });
    expect(result.current.formatted).toBe("017 8113 1905");

    rerender({ value: "01911111111" });
    expect(result.current.formatted).toBe("019 1111 1111");
    expect(result.current.operator).toBe("Banglalink");
  });

  it("normalizes a controlled value written in any shape", () => {
    const { result } = renderHook({ value: "+8801781131905" });
    expect(result.current.raw).toBe("01781131905");
  });
});

describe("useBdPhone — onChange contract", () => {
  it("reports digits plus full validation details", () => {
    const onChange = vi.fn<(value: string, details: PhoneChangeDetails) => void>();
    const { result } = renderHook({ onChange });

    act(() => result.current.onChange("+8801781131905"));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [value, details] = onChange.mock.calls[0];
    expect(value).toBe("01781131905");
    expect(details.raw).toBe("01781131905");
    expect(details.formatted).toBe("017 8113 1905");
    expect(details.normalized).toBe("+8801781131905");
    expect(details.operator).toBe("Grameenphone");
    expect(details.isValid).toBe(true);
  });

  it("uses the latest callback even when it is an inline arrow", () => {
    const calls: string[] = [];

    function Wrapper() {
      const [tag, setTag] = useState("first");
      const phone = useBdPhone({ onChange: (value) => calls.push(`${tag}:${value}`) });
      return (
        <button onClick={() => { setTag("second"); phone.onChange("017"); }}>
          go
        </button>
      );
    }

    render(<Wrapper />);
    act(() => screen.getByRole("button").click());
    act(() => screen.getByRole("button").click());

    expect(calls).toEqual(["first:017", "second:017"]);
  });
});
