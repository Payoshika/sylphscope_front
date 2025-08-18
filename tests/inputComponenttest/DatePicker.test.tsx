import React from "react";
import { render, screen } from "@testing-library/react";
import DatePicker from "../../src/components/inputComponents/datePickers/DatePicker";

describe("DatePicker", () => {
  it("renders day/month/year selects", () => {
    const value = { day: "", month: "", year: "" };
    const onChange = () => {};
    render(
      <DatePicker id="d" name="d" label="Date" value={value} onChange={onChange} />
    );
    expect(screen.getByText("Day") || screen.queryByPlaceholderText("Day")).toBeTruthy();
    expect(screen.getByText("Month") || screen.queryByPlaceholderText("Month")).toBeTruthy();
    expect(screen.getByText("Year") || screen.queryByPlaceholderText("Year")).toBeTruthy();
  });
});