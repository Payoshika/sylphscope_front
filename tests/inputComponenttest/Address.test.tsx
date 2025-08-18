import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Address from "../../src/components/inputComponents/Address";

describe("Address", () => {
  const baseProps = {
    id: "address",
    name: "address",
    label: "Address",
    countryCode: "GB",
    value: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      region: "",
    },
    onChange: vi.fn(),
  };

  it("renders fields and calls onChange for city", () => {
    render(<Address {...baseProps} />);
    const cityInput = screen.getByPlaceholderText("City");
    expect(cityInput).toBeInTheDocument();
    fireEvent.change(cityInput, { target: { value: "London" } });
    expect(baseProps.onChange).toHaveBeenCalled();
  });
});