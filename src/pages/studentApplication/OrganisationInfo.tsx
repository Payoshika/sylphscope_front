import React, { useEffect, useState } from "react";
import { getProviderById } from "../../services/ProviderService";
import type { Provider } from "../../types/provider";

interface OrganisationInfoProps {
  grantProgram: { providerId: string };
}

const OrganisationInfo: React.FC<OrganisationInfoProps> = ({ grantProgram }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Reset loading when grantProgram changes
    const fetchProvider = async () => {
      if (!grantProgram?.providerId) {
        setProvider(null);
        setLoading(false);
        return;
      }
      try {
        const response = await getProviderById(grantProgram.providerId);
        setProvider(response.data);
      } catch (err) {
        setProvider(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [grantProgram]); 

  if (loading) {
    return <div>Loading organisation info...</div>;
  }

  if (!provider) {
    return <div>No organisation info available.</div>;
  }

  return (
    <div>
                <h2>Content and design to be updated</h2>
      <h2>{provider.organisationName}</h2>
      <p><strong>Email:</strong> {provider.contactEmail}</p>
      <p><strong>Phone:</strong> {provider.contactPhone}</p>
      <p><strong>Website:</strong> {provider.websiteUrl}</p>
      <p><strong>Description:</strong> {provider.organisationDescription}</p>
      {provider.logoUrl && (
        <img src={provider.logoUrl} alt="Organisation Logo" style={{ maxWidth: "200px" }} />
      )}
    </div>
  );
};

export default OrganisationInfo;