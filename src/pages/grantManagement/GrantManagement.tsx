import { useEffect, useState } from "react";
import GrantManagementNav from "./GrantManagementNav";
import ListGrants from "./ListGrants";
import Message from "./Message";
import CreateGrant from "./CreateGrant";
import ReviewApplication from "./ReviewApplication";
import ReviewStudentAnswer from "./ReviewStudentAnswer";
import StaffProfile from "./StaffProfile";
import { useOutletContext } from "react-router-dom";
import type { Provider } from "../../types/provider";
import type { ProviderStaff } from "../../types/user";
import type { GrantProgram } from "../../types/grantProgram";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { getGrantProgramsByProviderId } from "../../services/GrantProgramService";

const steps = [
  { key: "create", label: "Create Grant" },
  { key: "list", label: "List Grants" },
  { key: "review", label: "Review Application" },
  { key: "messages", label: "Messages" },
  { key: "staff-profile", label: "My Profile" },
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

    if (provider === undefined || !providerStaff) {
    return <div>Loading grant management...</div>;
  }

  // If provider is null (user has no provider yet) render join/create UI
  if (!provider) {
    navigate("/organisation");
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
          <Route
            path="create"
            element={<CreateGrant grantPrograms={grantPrograms} />}
          />
          <Route
            path="messages"
            element={<Message />}
          />
          <Route
            path="review"
            element={<ReviewApplication provider={provider} grantPrograms={grantPrograms} />}
          />
          <Route
            path="review-student-answer/:applicationId/"
            element={<ReviewStudentAnswer/>}
          />
          <Route
            path="staff-profile"
            element={<StaffProfile />}
          />
          {/* Add more routes as needed */}
        </Routes>
      </main>
    </div>
  );
};

export default GrantManagement;