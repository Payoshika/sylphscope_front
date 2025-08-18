import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useForm } from "../../src/hooks/useForm";

// minimal onSubmit that returns
describe("useForm hook", () => {
  it("validates and submits", async () => {
    const onSubmit = vi.fn(async () => {});
    const { result } = renderHook(() =>
      useForm({
        initialValues: { a: "" },
        validate: (vals: any) => (vals.a ? {} : { a: "required" }),
        onSubmit,
      })
    );
    await act(async () => {
      result.current.handleSubmit({ preventDefault: () => {} } as any);
    });
    expect(result.current.errors.a).toBeDefined();
  });
});