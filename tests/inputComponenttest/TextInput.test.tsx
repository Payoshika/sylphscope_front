import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "../../src/components/inputComponents/TextInput";

describe("TextInput", () => {
  it("renders and responds to input", () => {
    const onChange = vi.fn();
    render(
      <TextInput id="t" name="t" label="Label" value="" onChange={onChange} />
    );
    const input = screen.getByLabelText("Label") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalled();
  });
});