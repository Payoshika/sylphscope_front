import React from "react";
import { render, screen } from "@testing-library/react";
import List from "../../src/components/basicComponents/List";

describe("List", () => {
  it("renders items and variants", () => {
    render(<List items={["a", "b"]} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();

    render(<List items={["x"]} variant="bordered" />);
    expect(screen.getByText("x")).toBeInTheDocument();
  });
});