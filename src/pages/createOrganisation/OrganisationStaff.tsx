import React, { useEffect, useState } from "react";
import type { ProviderStaff } from "../../types/user";
import type { Provider } from "../../types/provider";
import { getStaffByProviderId, removeStaff } from "../../services/ProviderService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";

interface OrganisationStaffProps {
  provider: Provider;
  onNext: () => void;
  onBack: () => void;
}

const OrganisationStaff: React.FC<OrganisationStaffProps> = ({ provider, onNext, onBack }) => {
  const [staff, setStaff] = useState<ProviderStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingStaff, setRemovingStaff] = useState<string | null>(null);

  useEffect(() => {
    fetchStaff();
  }, [provider.id]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const staffList = await getStaffByProviderId(provider.id);
      setStaff(staffList);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    try {
      setRemovingStaff(staffId);
      await removeStaff(staffId);
      // Refresh the staff list after removal
      await fetchStaff();
      alert("Staff member removed successfully!");
    } catch (error) {
      console.error("Failed to remove staff:", error);
      alert("Failed to remove staff member");
    } finally {
      setRemovingStaff(null);
    }
  };

  const getRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getFullName = (staff: ProviderStaff) => {
    const firstName = staff.firstName || "";
    const middleName = staff.middleName || "";
    const lastName = staff.lastName || "";
    
    const nameParts = [firstName, middleName, lastName].filter(part => part.trim());
    return nameParts.join(" ").trim() || "Unknown Staff";
  };

  if (loading) {
    return (
      <div className="content">
        <TitleAndHeadLine
          title="Organisation Staff"
          headline="Manage your organisation staff"
          provider={true}
        />
        <div className="loading-container">
          <p>Loading staff members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Organisation Staff"
        headline="Manage your organisation staff"
        provider={true}
      />
      
      <div className="staff-section">
        <div className="staff-header">
          <h3>Current Staff Members</h3>
          <p>Manage your organisation's staff members</p>
        </div>

        {staff.length === 0 ? (
          <div className="no-staff-message">
            <p>No staff members found for this organisation.</p>
          </div>
        ) : (
          <div className="staff-list">
            {staff.map((staffMember) => (
              <div key={staffMember.id} className="staff-item">
                <div className="staff-info">
                  <div className="staff-name">
                    <h4>{getFullName(staffMember)}</h4>
                    <span className="staff-role">{getRoleDisplay(staffMember.role)}</span>
                  </div>
                  <div className="staff-details">
                    <p>Staff ID: {staffMember.id}</p>
                    <p>User ID: {staffMember.userId}</p>
                  </div>
                </div>
                <div className="staff-actions">
                  <Button
                    text={removingStaff === staffMember.id ? "Removing..." : "Remove"}
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveStaff(staffMember.id)}
                    disabled={removingStaff === staffMember.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <Button
          text="Back"
          type="button"
          variant="outline"
          onClick={onBack}
        />
        <Button
          text="Next"
          type="button"
          variant="primary"
          onClick={onNext}
        />
      </div>
    </div>
  );
};

export default OrganisationStaff;
