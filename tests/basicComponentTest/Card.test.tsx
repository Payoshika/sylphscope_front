import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "../../src/components/basicComponents/Card";
import { describe, vi, it, expect } from "vitest";

describe("Card", () => {
  it("renders title, subtitle, children and footer", () => {
    render(
      <Card title="T" subtitle="S" footer={<div>F</div>}>
        <div>child</div>
      </Card>
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("child")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });
});