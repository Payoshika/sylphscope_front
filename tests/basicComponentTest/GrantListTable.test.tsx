import React from "react";
import { render, screen } from "@testing-library/react";
import GrantListTable from "../../src/components/basicComponents/GrantListTable";

describe("GrantListTable", () => {
  it("renders header and entries", () => {
    const grants = [{ id: "g1", title: "G1", description: "D1", providerId: "p1" }];
    render(<GrantListTable grants={grants as any} providers={{}} onSearch={() => {}} onSort={() => {}} headers={[{ label: "Title", key: "title" }]} />);
    expect(screen.getByText("G1")).toBeInTheDocument();
  });
});