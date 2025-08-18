import React from "react";
import { render, screen } from "@testing-library/react";
import ApplicationListTable from "../../src/components/basicComponents/ApplicationListTable";

const dummyApplications = [
  {
    application: {
      id: "app1",
      studentId: "s1",
      status: "applied",
      submittedAt: "2025-01-01",
      updatedAt: "2025-01-02",
      eligibilityResult: { eligible: true },
    },
    grantProgram: { id: "g1", title: "Grant 1", description: "d", providerId: "p1" },
  },
];

const dummyProvider = { id: "p1", name: "Provider" };

describe("ApplicationListTable", () => {
  it("renders rows and shows student label and status", () => {
    render(
      <ApplicationListTable
        applications={dummyApplications as any}
        provider={dummyProvider as any}
        headers={[{ label: "Title", key: "title" }]}
        markingScores={{}}
        applicantNames={{}}
        appliedDates={{}}
      />
    );
    // component displays student label when applicantNames not provided
    expect(screen.getByText(/Student s1/i)).toBeInTheDocument();
    expect(screen.getByText(/Eligible|Not Eligible/i)).toBeInTheDocument();
  });
});