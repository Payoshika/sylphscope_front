import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "../../src/components/basicComponents/Badge";

describe("Badge", () => {
  it("renders text and variant", () => {
    render(<Badge text="New" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });
});