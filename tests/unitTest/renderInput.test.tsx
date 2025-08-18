import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { renderInput } from "../../src/utility/QuestionInput";

// Files referenced:
// - renderInput: ../../src/utility/QuestionInput.tsx

describe("renderInput helper", () => {
  it("renders NUMBER input and forwards numeric value via onChange", () => {
    const onChange = vi.fn();
    const question = { id: "q1", inputType: "NUMBER", questionText: "Age", isRequired: false };
    const el = render(<div>{renderInput(question, [], "", onChange)}</div>);
    const input = screen.getByLabelText("Age") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "42" } });
    expect(onChange).toHaveBeenCalledWith("q1", 42);
  });

  it("renders TEXTAREA and forwards string value", () => {
    const onChange = vi.fn();
    const question = { id: "q2", inputType: "TEXTAREA", questionText: "Bio", isRequired: false };
    render(<div>{renderInput(question, [], "init", onChange)}</div>);
    const ta = screen.getByLabelText("Bio") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("q2", "hello");
  });
});