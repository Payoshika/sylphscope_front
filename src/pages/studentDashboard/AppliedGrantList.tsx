import React, { useEffect, useState } from "react";
import Card from "../../components/basicComponents/Card";
import Button from "../../components/basicComponents/Button";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getGrantProgramAndApplicationByStudentId } from "../../services/ApplicationService";
import type { GrantProgramApplicationDto } from "../../types/application";
import type { Student } from "../../types/student";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

const AppliedGrantList: React.FC = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const [appliedGrants, setAppliedGrants] = useState<GrantProgramApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <TitleAndHeadLine
        title="Applied Grants"
        headline="list of grant you have applied"
        student={true}
      />
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
              <Button
                text="View Application"
                type="button"
                onClick={() => navigate(`/student-application/${grantProgram.id}`)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default AppliedGrantList;