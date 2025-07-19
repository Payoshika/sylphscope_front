import React from "react";

import Card from "../../components/basicComponents/Card";
import type { Student } from "../../types/student";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../components/basicComponents/Button";
import { useState, useEffect } from "react";
import { getGrantProgramsByStudentId } from "../../services/GrantProgramService";
import { createApplicationByStudentAndGrantProgramId } from "../../services/ApplicationService";

interface GrantListProps {
}

const GrantList: React.FC<GrantListProps> = () => {
    const { student, setStudent, updateStudent } = useOutletContext<{
      student: Student;
      setStudent: (s: Student) => void;
      updateStudent: (s: Student) => Promise<Student>;
    }>();
    const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
    const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0, number: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGrants = async () => {
            if (!student?.id) return;
            const data = await getGrantProgramsByStudentId(student.id, 0, 10);
            setGrantPrograms(data.content);
            setPageInfo({
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            number: data.number,
            });
        };
        fetchGrants();
        }, [student?.id]);

    const handleApply = async (grantId: string) => {
    if (!student?.id) return;
    try {
      await createApplicationByStudentAndGrantProgramId(student.id, grantId);
      alert("Application created successfully!");
    } catch (err) {
      alert("Failed to create application.");
    }
  };

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
                onClick={() => handleApply(grant.id)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
    );
};

export default GrantList;