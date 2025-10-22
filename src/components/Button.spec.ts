// tests/Button.spec.ts
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import Button from "./Button.vue";

function getClasses(node: HTMLElement) {
  return node.className.split(/\s+/);
}

describe("Button.vue", () => {
  it("renders with defaults (primary, not block, type=button)", () => {
    const { getByRole } = render(Button, { props: { label: "Click me" } });
    const btn = getByRole("button");

    // text
    expect(btn).toHaveTextContent("Click me");
    // type default
    expect(btn).toHaveAttribute("type", "button");

    const classes = getClasses(btn);
    // base classes exist
    expect(classes).toEqual(expect.arrayContaining(["rounded-md", "font-medium", "px-4", "py-2.5"]));
    // primary variant classes
    expect(classes).toEqual(expect.arrayContaining(["bg-emerald-500", "text-white", "focus:ring-emerald-400"]));
    // not block
    expect(classes).not.toContain("w-full");
  });

  it("applies secondary variant classes", () => {
    const { getByRole } = render(Button, { props: { label: "Secondary", variant: "secondary" } });
    const btn = getByRole("button");
    const classes = getClasses(btn);
    expect(classes).toEqual(expect.arrayContaining(["bg-pink-500", "text-white", "focus:ring-indigo-400"]));
    // and not primary’s ring
    expect(classes).not.toContain("focus:ring-emerald-400");
  });

  it("adds full width when block=true", () => {
    const { getByRole } = render(Button, { props: { label: "Block", block: true } });
    const btn = getByRole("button");
    expect(getClasses(btn)).toContain("w-full");
  });

  it("emits click when enabled", async () => {
    const onClick = vi.fn();
    const { getByRole, emitted } = render(Button, {
      props: { label: "Go", onClick }, // listeners automatically bound
    });
    const btn = getByRole("button");

    await fireEvent.click(btn);

    // listener called
    expect(onClick).toHaveBeenCalledTimes(1);
    // component emit also exists (named "click")
    const ev = emitted().click;
    expect(ev?.length).toBe(1);
    expect(ev?.[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it("does not emit when disabled", async () => {
    const onClick = vi.fn();
    const { getByRole, emitted } = render(Button, {
      props: { label: "Nope", disabled: true, onClick },
    });
    const btn = getByRole("button");
    expect(btn).toBeDisabled();

    await fireEvent.click(btn);

    expect(onClick).not.toHaveBeenCalled();
    expect(emitted().click).toBeUndefined();
  });

  it("respects explicit type (submit)", () => {
    const { getByRole } = render(Button, { props: { label: "Submit", type: "submit" } });
    const btn = getByRole("button");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("renders slot content over label (fallback)", () => {
    const { getByRole, queryByText } = render(Button, {
      props: { label: "Fallback" },
      slots: { default: "<span>Slot Text</span>" },
    });
    const btn = getByRole("button");
    expect(btn).toHaveTextContent("Slot Text");
    expect(queryByText("Fallback")).toBeNull();
  });
});
