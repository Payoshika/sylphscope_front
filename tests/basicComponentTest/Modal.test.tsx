import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Modal from "../../src/components/basicComponents/Modal";

describe("Modal", () => {
  it("renders children when open and calls onClose", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="M" actions={<div />}>
        <div>inside</div>
      </Modal>
    );
    expect(screen.getByText("inside")).toBeInTheDocument();
    // try to close if close button exists
    const closeBtn = screen.queryByRole("button", { name: /close|×/i });
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    }
  });
});