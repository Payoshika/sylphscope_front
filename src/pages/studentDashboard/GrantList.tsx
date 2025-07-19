import React from "react";
import Card from "../../components/basicComponents/Card";
import type { Student } from "../../types/student";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../components/basicComponents/Button";

interface GrantListProps {
  grantPrograms: GrantProgram[];
  loading: boolean;
}

const GrantList: React.FC<GrantListProps> = ({ grantPrograms, loading }) => {
    const { student, setStudent, updateStudent } = useOutletContext<{
      student: Student;
      setStudent: (s: Student) => void;
      updateStudent: (s: Student) => Promise<Student>;
    }>();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading grants...</div>;
  }

  return (
    <div className="content">
      <h2>Available Grants</h2>
      {grantPrograms.length === 0 ? (
        <p>No grants to display.</p>
      ) : (
        <div className="grant-list">
          {grantPrograms.map((grant) => (
            <Card
              key={grant.id}
              title={grant.title}
              subtitle={grant.status}
            >
              <p>{grant.description}</p>
              <p>
                <strong>Application Period:</strong>{" "}
                {grant.schedule?.applicationStartDate?.slice(0, 10)} - {grant.schedule?.applicationEndDate?.slice(0, 10)}
              </p>
              <p>
                <strong>Provider:</strong> {grant.providerId}
              </p>
              <p>
                <strong>Grant ID:</strong> {grant.id}
              </p>
              <Button
                text="Apply"
                type="button"
                onClick={() => navigate(`/apply/${grant.id}`)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
    );
};

export default GrantList;