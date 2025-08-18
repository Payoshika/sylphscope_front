import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Button from "../../src/components/basicComponents/Button";

describe("Button", () => {
  it("renders text and calls onClick", () => {
    const handle = vi.fn();
    render(<Button text="Click me" onClick={handle} />);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handle).toHaveBeenCalled();
  });

  it("applies variant, size and fullWidth classes", () => {
    render(<Button text="Test" variant="outline" size="small" fullWidth />);
    const btn = screen.getByRole("button", { name: /test/i });
    expect(btn.className).toContain("btn--outline");
    expect(btn.className).toContain("btn--small");
    expect(btn.className).toContain("btn--full");
  });

  it("is disabled when disabled prop is true and does not call onClick", () => {
    const handle = vi.fn();
    render(<Button text="Disabled" disabled onClick={handle} />);
    const btn = screen.getByRole("button", { name: /disabled/i }) as HTMLButtonElement;
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handle).not.toHaveBeenCalled();
  });

  it("renders with correct type attribute", () => {
    render(<Button text="Submit" type="submit" />);
    const btn = screen.getByRole("button", { name: /submit/i });
    expect(btn).toHaveAttribute("type", "submit");
  });
});