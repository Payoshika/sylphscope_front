import React from "react";
import type { GrantProgram } from "../../types/grantProgram";

interface GrantOverviewProps {
  grantProgram: GrantProgram | null;
}

const GrantOverview: React.FC<GrantOverviewProps> = ({ grantProgram }) => {
  if (!grantProgram) {
    return <div>No grant program information available.</div>;
  }

  return (
    <div>
        <h2>Content and design to be updated</h2>
      <h2>{grantProgram.title}</h2>
      <p>{grantProgram.description}</p>
      <p>
        <strong>Provider:</strong> {grantProgram.providerId}
      </p>
      <p>
        <strong>Application Period:</strong>{" "}
        {grantProgram.schedule?.applicationStartDate?.slice(0, 10)} - {grantProgram.schedule?.applicationEndDate?.slice(0, 10)}
      </p>
      <p>
        <strong>Grant ID:</strong> {grantProgram.id}
      </p>
    </div>
  );
};
export default GrantOverview;