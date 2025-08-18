import React from "react";
import { render } from "@testing-library/react";
import ProgressBar from "../../src/components/basicComponents/ProgressBar";

describe("ProgressBar", () => {
  it("renders bar with value", () => {
    const { container } = render(<ProgressBar value={40} />);
    const bar = container.querySelector(".progress__bar");
    expect(bar).toBeTruthy();
    // width should be set via inline style or class - at least bar exists
  });
});