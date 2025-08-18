import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "../../src/components/inputComponents/Checkbox";

describe("Checkbox", () => {
  it("renders label and toggles", () => {
    const handle = vi.fn();
    render(
      <Checkbox id="cb" name="cb" label="Agree" checked={false} onChange={handle} />
    );
    const checkbox = screen.getByRole("checkbox", { name: /agree/i }) as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(handle).toHaveBeenCalled();
  });
});