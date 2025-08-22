import React, { useEffect, useState } from "react";
import type { ProviderStaff } from "../../types/user";
import type { Provider } from "../../types/provider";
import { createProviderInvitationCode, getStaffByProviderId, removeStaff, updateStaffProfile, switchManager } from "../../services/ProviderService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import TextInput from "../../components/inputComponents/TextInput";
import Select from "../../components/inputComponents/Select";
import { useToast } from "../../contexts/ToastContext";
import { useOutletContext } from "react-router-dom";
interface OrganisationStaffProps {
  provider: Provider;
  onNext: () => void;
  onBack: () => void;
}

const OrganisationStaff: React.FC<OrganisationStaffProps> = ({ provider, onNext, onBack }) => {
  const { showSuccess, showError } = useToast();
  const { providerStaff } = useOutletContext<{ providerStaff: ProviderStaff; provider: Provider }>();
  const [staff, setStaff] = useState<ProviderStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingStaff, setRemovingStaff] = useState<string | null>(null);
  console.log("providerStaff in OrganisationStaff", providerStaff);
  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string>(provider?.invitationCode ?? "");
  const [isSavingInvitation, setIsSavingInvitation] = useState(false);

  // role-saving state to disable individual role select while saving
  const [savingRoleFor, setSavingRoleFor] = useState<string | null>(null);

  // Manager switch state
  const [selectedNewManagerId, setSelectedNewManagerId] = useState<string>("");
  const [isSwitchingManager, setIsSwitchingManager] = useState(false);

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

  const isManager = (providerStaff?.role || "").toString().toLowerCase() === "manager";

  const handleRemoveStaff = async (staffId: string) => {
    // Manager-only removal
    if (!isManager) {
      showError("Only managers can remove staff", "Permission");
      return;
    }
  // Prevent manager removing themself
  if (providerStaff?.id === staffId && (providerStaff?.role || "").toString().toLowerCase() === "manager") {
      showError("You cannot remove yourself as manager", "Action not allowed");
      return;
    }

    try {
      setRemovingStaff(staffId);
      await removeStaff(staffId);
      await fetchStaff();
      showSuccess("Staff member removed", "Success");
    } catch (error) {
      console.error("Failed to remove staff:", error);
      showError("Failed to remove staff member", "Error");
    } finally {
      setRemovingStaff(null);
    }
  };

  const handleRoleChange = async (staffMember: ProviderStaff, newRole: string) => {
    if (!isManager) {
      showError("Only managers can change roles", "Permission");
      return;
    }

    // Avoid no-op updates
    if (staffMember.role === newRole) return;

    setSavingRoleFor(staffMember.id);
    try {
      const updated = { ...staffMember, role: newRole } as ProviderStaff;
      await updateStaffProfile(updated);
      await fetchStaff();
      showSuccess("Staff role updated", "Success");
    } catch (err) {
      console.error("Failed to update staff role:", err);
      showError("Failed to update staff role", "Error");
    } finally {
      setSavingRoleFor(null);
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

  const handleSwitchManager = async () => {
    if (!isManager) {
      showError("Only managers can switch manager role", "Permission");
      return;
    }
    if (!selectedNewManagerId) {
      showError("Please select a staff member to promote", "Validation");
      return;
    }
    if (!providerStaff?.id) {
      showError("Current manager not found", "Error");
      return;
    }
    // Prevent switching to self
    if (selectedNewManagerId === providerStaff.id) {
      showError("Cannot switch manager to yourself", "Validation");
      return;
    }

    setIsSwitchingManager(true);
    try {
      await switchManager(providerStaff.id, selectedNewManagerId);
      await fetchStaff();
      showSuccess("Manager role switched successfully", "Success");
      setSelectedNewManagerId("");
    } catch (err) {
      console.error("Failed to switch manager:", err);
      showError("Failed to switch manager. Please try again.", "Error");
    } finally {
      setIsSwitchingManager(false);
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

      {/* Manager-only: switch manager UI */}
      {isManager && (
        <div className="section-box" style={{ marginBottom: 16 }}>
          <h5>Switch Manager</h5>
          <p>Select a staff member to promote to Manager. Current manager will be demoted to Administrator.</p>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginTop: 8 }}>
            <Select
              id="switch-manager-select"
              name="switchManager"
              label="Choose staff to promote"
              value={selectedNewManagerId}
              onChange={(e) => setSelectedNewManagerId(e.target.value)}
              options={
                staff
                  .filter(s => s.id !== providerStaff?.id) // exclude self
                  .map(s => ({ value: s.id, label: getFullName(s) }))
              }
              placeholder="Select staff..."
            />
            <Button
              text={isSwitchingManager ? "Switching..." : "Switch Manager"}
              onClick={handleSwitchManager}
              disabled={isSwitchingManager || !selectedNewManagerId}
              variant="primary"
            />
          </div>
        </div>
      )}

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
          <ul className="staff-list" role="list">
            {staff.map((staffMember) => (
              <li key={staffMember.id} className="staff-item" role="listitem">
                <div className="staff-info">
                  <div className="staff-name">
                    <h4>{`${staffMember.firstName ?? ""} ${staffMember.middleName ?? ""} ${staffMember.lastName ?? ""}`.trim() || "Unknown Staff"}</h4>
                    <div className="staff-role">
                      {isManager ? (
                        <Select
                          id={`role-${staffMember.id}`}
                          name={`role-${staffMember.id}`}
                          label=""
                          value={staffMember.role}
                          onChange={(e) => handleRoleChange(staffMember, e.target.value)}
                          options={[
                            { value: "manager", label: "Manager" },
                            { value: "administrator", label: "Administrator" },
                            { value: "assessor", label: "Assessor" },
                            { value: "volunteer", label: "Volunteer" },
                          ]}
                          // disable changing role for any staff member whose role is manager
                          disabled={
                            savingRoleFor === staffMember.id || (staffMember.role || "").toString().toLowerCase() === "manager"
                          }
                        />
                      ) : (
                        <span>{getRoleDisplay(staffMember.role)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="staff-actions">
                    {isManager && (
                      <Button
                        text={removingStaff === staffMember.id ? "Removing..." : "Remove"}
                        type="button"
                        variant="primary"
                        onClick={() => handleRemoveStaff(staffMember.id)}
                        disabled={
                          removingStaff === staffMember.id ||
                          (providerStaff?.id === staffMember.id && (staffMember.role || "").toString().toLowerCase() === "manager")
                        }
                      />
                    )}
                </div>
              </li>
            ))}
          </ul>
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

      <div className="navigation-buttons" style={{ marginTop: 20 }}>
        <Button text="Back" type="button" variant="outline" onClick={onBack} />
        <Button text="Next" type="button" variant="primary" onClick={onNext} />
      </div>
    </div>
  );
};

export default OrganisationStaff;
