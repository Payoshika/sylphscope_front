import React, { useEffect, useState } from "react";
import { getProviderById } from "../../services/ProviderService";
import type { Provider } from "../../types/provider";
import type { GrantProgram } from "../../types/grantProgram";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

interface OrganisationInfoProps {
  grantProgram: GrantProgram | null;
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
    return (
      <div className="content">
        <TitleAndHeadLine
          title="Organisation Information"
          headline="Loading organisation details..."
          student={true}
        />
        <div className="loading-container">
          <p>Loading organisation info...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="content">
        <TitleAndHeadLine
          title="Organisation Information"
          headline="No organisation information available"
          student={true}
        />
        <div className="no-data-message">
          <p>No organisation info available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Organisation Information"
        headline="Learn more about the organisation offering this grant"
        student={true}
      />
      
      <div className="organisation-section">
        <div className="organisation-header">
          <h3>{provider.organisationName}</h3>
          {provider.logoUrl && (
            <div className="organisation-logo">
              <img src={provider.logoUrl} alt="Organisation Logo" />
            </div>
          )}
        </div>

        <div className="organisation-details">
          <div className="detail-item">
            <strong>Contact Email:</strong>
            <span>{provider.contactEmail}</span>
          </div>
          <div className="detail-item">
            <strong>Contact Phone:</strong>
            <span>{provider.contactPhone}</span>
          </div>
          <div className="detail-item">
            <strong>Website:</strong>
            <span>
              <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">
                {provider.websiteUrl}
              </a>
            </span>
          </div>
          <div className="detail-item">
            <strong>Description:</strong>
            <span>{provider.organisationDescription}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationInfo;