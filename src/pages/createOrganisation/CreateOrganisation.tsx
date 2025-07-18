import OrganisationNav from "./OrganisationNav";
import OrganisationName from "./OrganisationName";
import OrganisationDescription from "./OrganisationDescription";
import { useOutletContext } from "react-router-dom";
import type { Provider } from "../../types/provider";
import type { ProviderStaff } from "../../types/user";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { updateProvider } from "../../services/ProviderService";

const steps = [
  { key: "name", label: "Organisation Name" },
  { key: "description", label: "Description" },
];

const initialOrganisation: Provider = {
  id: "",
  organisationName: "",
  contactEmail: "",
  contactPhone: "",
  websiteUrl: "",
  organisationDescription: "",
  logoUrl: "",
  createdAt: "",
};

const CreateOrganisation = () => {
  // Get providerStaff and provider from ProviderLayout
  const { providerStaff, provider } = useOutletContext<{ providerStaff: ProviderStaff; provider: Provider }>();
  const [organisation, setOrganisation] = useState<Provider>(provider ?? initialOrganisation);

  useEffect(() => {
    if (provider) {
      setOrganisation(provider);
    }
  }, [provider]);

  const navigate = useNavigate();
  const location = useLocation();
  const handleStepChange = (stepKey: string) => {
    navigate(`/organisation/${stepKey}`);
  };

const handleUpdateProvider = async (organisation: Provider) => {
    return updateProvider(organisation);
};

  // Optionally, you can show a loading spinner until provider is loaded
  if (!provider) {
    return <div>Loading organisation...</div>;
  }

  return (
    <div className="grant-create-layout">
      <OrganisationNav
        steps={steps}
        currentStep={location.pathname.split("/").pop() || steps[0].key}
        onStepChange={handleStepChange}
      />
      <main className="grant-create-content">
        <Routes>
          <Route path="/" element={<Navigate to="name" replace />} />
          <Route
            path="name"
            element={
              <OrganisationName
                organisation={organisation}
                onOrganisationChange={setOrganisation}
                providerStaff={providerStaff}
                onUpdateProvider={handleUpdateProvider}
              />
            }
          />
          <Route
            path="description"
            element={
              <OrganisationDescription
                organisation={organisation}
                onOrganisationChange={setOrganisation}
                providerStaff={providerStaff}
                onUpdateProvider={handleUpdateProvider}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default CreateOrganisation;