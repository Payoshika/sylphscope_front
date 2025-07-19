import { useEffect, useState } from "react";
import GrantManagementNav from "./GrantManagementNav";
import ListGrants from "./ListGrants";
import { useOutletContext } from "react-router-dom";
import type { Provider } from "../../types/provider";
import type { ProviderStaff } from "../../types/user";
import type { GrantProgram } from "../../types/grantProgram";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { getGrantProgramsByProviderId } from "../../services/GrantProgramService";

const steps = [
  { key: "list", label: "List Grants" },
  // Add more steps as needed
];

const GrantManagement = () => {
  const { providerStaff, provider } = useOutletContext<{ providerStaff: ProviderStaff; provider: Provider }>();
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
  const [loadingGrants, setLoadingGrants] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleStepChange = (stepKey: string) => {
    navigate(`/grant-management/${stepKey}`);
  };

  useEffect(() => {
    const fetchGrants = async () => {
      if (provider?.id) {
        setLoadingGrants(true);
        try {
          const grants = await getGrantProgramsByProviderId(provider.id);
          setGrantPrograms(grants);
          console.log(grants);
          console.log(grantPrograms);
        } catch (err) {
          setGrantPrograms([]);
        }
        setLoadingGrants(false);
      }
    };
    fetchGrants();
  }, [provider?.id]);

  if (!provider || !providerStaff) {
    return <div>Loading grant management...</div>;
  }

  return (
    <div className="grant-create-layout">
      <GrantManagementNav
        steps={steps}
        currentStep={location.pathname.split("/").pop() || steps[0].key}
        onStepChange={handleStepChange}
      />
      <main className="grant-create-content">
        <Routes>
          <Route path="/" element={<Navigate to="list" replace />} />
          <Route
            path="list"
            element={
              <ListGrants
                provider={provider}
                grantPrograms={grantPrograms}
                loading={loadingGrants}
              />
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </main>
    </div>
  );
};

export default GrantManagement;