import React from "react";
import Card from "../../components/basicComponents/Card";
import type { Provider } from "../../types/provider";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate } from "react-router-dom";
import Button from "../../components/basicComponents/Button";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

interface ListGrantsProps {
  provider: Provider;
  grantPrograms: GrantProgram[];
  loading: boolean;
}

const ListGrants: React.FC<ListGrantsProps> = ({ provider, grantPrograms, loading }) => {
  const navigate = useNavigate();


  if (loading) {
    return <div>Loading grants...</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine title="List of Grants" headline="List of Grants" provider={true} />
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
                <strong>Provider:</strong> {provider.organisationName}
              </p>
            <p>
                <strong>Grant ID:</strong> {grant.id}
            </p>
              <Button
                text="Manage Grant"
                type="button"
                onClick={() => navigate(`/create-grant/${grant.id}`)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListGrants;