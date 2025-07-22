import React from 'react';
import { useOutletContext } from "react-router-dom";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import type { Student } from "../../types/student";

const FurtherInfo: React.FC = () => {
  // Get context for consistency, even if not used yet
  const { student } = useOutletContext<{ student: Student }>();

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Further Information"
        headline="Frequently asked core questions for most grant programs"
        student={true}
      />
      {/* Placeholder for future FAQ or info content */}
      <div className="further-info-placeholder">
        <p>Frequently asked core questions for most of the grant programs will be shown here.</p>
      </div>
    </div>
  );
};

export default FurtherInfo;