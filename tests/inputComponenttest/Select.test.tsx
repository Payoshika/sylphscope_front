import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Select from "../../src/components/inputComponents/Select";

describe("Select", () => {
  it("renders options and changes value", () => {
    const onChange = vi.fn();
    render(
      <Select
        id="s"
        name="s"
        label="Choose"
        value=""
        onChange={onChange}
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />
    );
    // open custom dropdown by pressing Enter or clicking the trigger
    const trigger = screen.getByRole("combobox", { name: /Choose/i });
    fireEvent.click(trigger);
    // click option B
    const optionB = screen.getByText("B");
    fireEvent.click(optionB);
    expect(onChange).toHaveBeenCalled();
  });
});