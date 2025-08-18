import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Textarea from "../../src/components/inputComponents/Textarea";

describe("Textarea", () => {
  it("renders and expands on input", () => {
    const onChange = vi.fn();
    render(
      <Textarea id="ta" name="ta" label="Msg" value="" onChange={onChange} />
    );
    const ta = screen.getByLabelText("Msg") as HTMLTextAreaElement;
    expect(ta).toBeInTheDocument();
    fireEvent.change(ta, { target: { value: "line1\nline2\nline3" } });
    expect(onChange).toHaveBeenCalled();
  });
});