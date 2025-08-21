import React, { useEffect, useState } from "react";
import type { ProviderStaff } from "../../types/user";
import type { Provider } from "../../types/provider";
import { getStaffByProviderId, removeStaff } from "../../services/ProviderService";
import { createProviderInvitationCode } from "../../services/ProviderService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import TextInput from "../../components/inputComponents/TextInput";
import { useToast } from "../../contexts/ToastContext";

interface OrganisationStaffProps {
  provider: Provider;
  onNext: () => void;
  onBack: () => void;
}

const OrganisationStaff: React.FC<OrganisationStaffProps> = ({ provider, onNext, onBack }) => {
  const { showSuccess, showError } = useToast();
  const [staff, setStaff] = useState<ProviderStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingStaff, setRemovingStaff] = useState<string | null>(null);

  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string>(provider?.invitationCode ?? "");
  const [isSavingInvitation, setIsSavingInvitation] = useState(false);

  useEffect(() => {
    fetchStaff();
    // keep local invitationCode in sync if provider prop changes
    setInvitationCode(provider?.invitationCode ?? "");
  }, [provider?.id, provider?.invitationCode]);

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

  const handleSaveInvitationCode = async () => {
    if (!provider?.id) {
      showError("Provider not available", "Error");
      return;
    }
    if (!invitationCode.trim()) {
      showError("Please enter an invitation code", "Validation");
      return;
    }
    setIsSavingInvitation(true);
    try {
      const updated = await createProviderInvitationCode(provider.id, invitationCode.trim());
      // update local state from response if available
      setInvitationCode(updated.invitationCode ?? invitationCode.trim());
      showSuccess("Invitation code saved", "Success");
    } catch (err: any) {
      console.error("Failed to set invitation code", err);
      if (err?.message?.includes("409") || err?.response?.status === 409) {
        showError("Invitation code already in use", "Conflict");
      } else {
        showError("Failed to save invitation code", "Error");
      }
    } finally {
      setIsSavingInvitation(false);
    }
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

      {/* Invitation code UI */}
      <div className="section-box" style={{ marginTop: 24 }}>
        <h5>Staff Invitation Code</h5>
        <p>Generate or update an invitation code staff can use to join your organisation.</p>
        <div style={{ marginTop: 12, maxWidth: 420 }}>
          <TextInput
            id="invitation-code"
            name="invitationCode"
            label="Invitation Code"
            placeholder="Enter invitation code (max 20 chars)"
            value={invitationCode}
            onChange={(e) => setInvitationCode((e.target.value || "").slice(0, 20))}
          />
          <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
            <Button
              text={provider?.invitationCode ? (isSavingInvitation ? "Updating..." : "Update Code") : (isSavingInvitation ? "Creating..." : "Create Code")}
              variant="primary"
              onClick={handleSaveInvitationCode}
              disabled={isSavingInvitation || !invitationCode.trim()}
            />
            <Button
              text="Clear"
              variant="outline"
              onClick={() => setInvitationCode("")}
              disabled={isSavingInvitation}
            />
          </div>
          <p className="caption" style={{ marginTop: 8 }}>
            Current code: {provider?.invitationCode ? provider.invitationCode : "Not set"}
          </p>
        </div>
      </div>

      {/* navigation buttons */}
      <div className="navigation-buttons" style={{ marginTop: 20 }}>
        <Button text="Back" type="button" variant="outline" onClick={onBack} />
        <Button text="Next" type="button" variant="primary" onClick={onNext} />
      </div>
    </div>
  );
};

export default OrganisationStaff;
