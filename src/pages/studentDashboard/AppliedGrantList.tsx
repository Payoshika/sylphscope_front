import React, { useEffect, useState } from "react";
import Card from "../../components/basicComponents/Card";
import Button from "../../components/basicComponents/Button";
import { useOutletContext } from "react-router-dom";
import { getGrantProgramAndApplicationByStudentId } from "../../services/ApplicationService";
import type { GrantProgramApplicationDto } from "../../types/application";
import type { Student } from "../../types/student";

const AppliedGrantList: React.FC = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const [appliedGrants, setAppliedGrants] = useState<GrantProgramApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedGrants = async () => {
      if (!student?.id) return;
      try {
        const data = await getGrantProgramAndApplicationByStudentId(student.id);
        setAppliedGrants(data);
      } catch (err) {
        setAppliedGrants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedGrants();
  }, [student?.id]);

  return (
    <div className="content">
      <h2>Applied Grants</h2>
      {loading ? (
        <p>Loading applied grants...</p>
      ) : appliedGrants.length === 0 ? (
        <p>No applied grants to display.</p>
      ) : (
        <div className="grant-list">
          {appliedGrants.map(({ grantProgram, application }) => (
            <Card
              key={grantProgram.id}
              title={grantProgram.title}
              subtitle={application.status}
            >
              <p>{grantProgram.description}</p>
              <p>
                <strong>Application Period:</strong>{" "}
                {grantProgram.schedule?.applicationStartDate?.slice(0, 10)} - {grantProgram.schedule?.applicationEndDate?.slice(0, 10)}
              </p>
              <p>
                <strong>Provider:</strong> {grantProgram.providerId}
              </p>
              <p>
                <strong>Grant ID:</strong> {grantProgram.id}
              </p>
              <p>
                <strong>Application Status:</strong> {application.status}
              </p>
              <p>
                <strong>Submitted At:</strong> {application.submittedAt?.slice(0, 10)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default AppliedGrantList;