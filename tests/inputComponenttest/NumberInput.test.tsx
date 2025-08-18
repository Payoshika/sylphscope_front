import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NumberInput from "../../src/components/inputComponents/NumberInput";

describe("NumberInput", () => {
  it("renders and accepts numeric input", () => {
    const onChange = vi.fn();
    render(
      <NumberInput id="n" name="n" label="Num" value={"" as any} onChange={onChange} disabled={false} />
    );
    const input = screen.getByLabelText("Num") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123" } });
    expect(onChange).toHaveBeenCalled();
  });
});