import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PhoneNumber from "../../src/components/inputComponents/Phonenumber";

describe("PhoneNumber", () => {
  it("renders and updates number", () => {
    const onChange = vi.fn();
    render(
      <PhoneNumber
        id="phone"
        name="phone"
        label="Phone"
        value={{ countryCode: "US", number: "" }}
        onChange={onChange}
      />
    );
    const input = screen.getByPlaceholderText("Enter phone number") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "1234567" } });
    expect(onChange).toHaveBeenCalled();
  });
});