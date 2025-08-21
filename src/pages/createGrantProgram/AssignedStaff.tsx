import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProviderStaff } from "../../types/user";
import { isManager } from "../../utility/permissions";
import { GrantStatus } from "../../types/grantProgram";
import type { Provider } from "../../types/provider";
import type { AssignedStaff as AssignedStaffType, ProviderStaffDto, StaffRole, GrantProgram } from "../../types/grantProgram";
import { getStaffByProviderId, getAssignedStaff, updateContactPerson, updateAssignedStaff } from "../../services/GrantProgramService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import SearchableMultiSelect from "../../components/inputComponents/SearchableMultiSelect";
import Select from "../../components/inputComponents/Select";
import Button from "../../components/basicComponents/Button";

interface AssignedStaffProps {
  grantProgramId: string;
  grantProgram: GrantProgram;
  onGrantProgramChange: (grantProgram: GrantProgram) => void;
}

const staffRoleOptions = [
  { value: "Manager", label: "Manager" },
  { value: "Administrator", label: "Administrator" },
  { value: "Assessor", label: "Assessor" },
  { value: "Volunteer", label: "Volunteer" },
];

const AssignedStaff: React.FC<AssignedStaffProps> = ({ grantProgramId, grantProgram, onGrantProgramChange }) => {
  const { provider, providerStaff } = useOutletContext<{ provider?: Provider; providerStaff?: ProviderStaff }>();
  const canModify = !!providerStaff && isManager(providerStaff) && grantProgram.status === GrantStatus.DRAFT;
  const isReadOnly = !canModify;

   // States for data
   const [allStaff, setAllStaff] = useState<ProviderStaffDto[]>([]);
   const [assignedStaff, setAssignedStaff] = useState<AssignedStaffType[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [staffList, assignedList] = await Promise.all([
          getStaffByProviderId(provider?.id ?? ""),
          getAssignedStaff(grantProgramId),
        ]);
        
        setAllStaff(staffList);
        setAssignedStaff(assignedList);
        setSelectedStaffIds(assignedList.map(staff => staff.staffId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch staff data");
      } finally {
        setIsLoading(false);
      }
    };

    if (provider?.id && grantProgramId) {
      fetchData();
    }
  }, [provider?.id, grantProgramId]);

  const handleStaffSelect = (selectedIds: string[]) => {
    if (isReadOnly) return;
    const newAssignments = selectedIds
      .filter(id => !assignedStaff.some(staff => staff.staffId === id))
      .map(id => ({
        staffId: id,
        roleOnProgram: "ASSESSOR" as StaffRole,
        assignedAt: new Date().toISOString()
      }));

    setAssignedStaff(prev => [...prev, ...newAssignments]);
    setSelectedStaffIds(selectedIds);
    setHasChanges(true);
  };

  const handleRemoveStaff = (staffId: string) => {
    if (isReadOnly) return;
    // Don't allow removing the contact person
    if (grantProgram.contactPerson?.id === staffId) {
      alert("Cannot remove the contact person. Please assign a new contact person first.");
      return;
    }

    setAssignedStaff(prev => prev.filter(staff => staff.staffId !== staffId));
    setSelectedStaffIds(prev => prev.filter(id => id !== staffId));
    setHasChanges(true);
  };

  const handleRoleChange = (staffId: string, newRole: StaffRole) => {
    if (isReadOnly) return;
    setAssignedStaff(prev => prev.map(staff => 
      staff.staffId === staffId 
        ? { ...staff, roleOnProgram: newRole }
        : staff
    ));
    setHasChanges(true);
  };

  const handleContactPersonChange = (staffId: string) => {
    if (isReadOnly) return;
    const selectedStaff = allStaff.find(staff => staff.id === staffId);
    if (selectedStaff) {
      onGrantProgramChange({
        ...grantProgram,
        contactPerson: selectedStaff
      });
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    if (isReadOnly) return;
    try {
      setIsSaving(true);
      setError(null);

      // Update contact person if it exists
      if (grantProgram.contactPerson) {
        await updateContactPerson(grantProgramId, grantProgram.contactPerson);
      }

      // Update assigned staff
      const updatedProgram = await updateAssignedStaff(grantProgramId, assignedStaff);
      
      // Update local state with server response
      onGrantProgramChange(updatedProgram);
      setHasChanges(false);
      alert("Staff assignments saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const getStaffName = (staffId: string) => {
    const staff = allStaff.find(s => s.id === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : "Unknown Staff";
  };

  if (isLoading) {
    return <div className="content">Loading staff information...</div>;
  }

  if (error) {
    return <div className="content">Error: {error}</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Assigned Staff"
        headline="Manage staff assignments for this grant program"
        provider={true}
      />
      <div className="staff-management-container">
        {/* Staff Selection */}
        <div className="section-box">
          <h5>Select Staff Members</h5>
          {isReadOnly ? (
            <div className="selected-staff-readonly">
              {selectedStaffIds.length > 0 ? (
                selectedStaffIds.map((id) => {
                  const staff = allStaff.find((s) => s.id === id);
                  const name = staff ? `${staff.firstName || ""} ${staff.lastName || ""}`.trim() : getStaffName(id);
                  const initials = staff
                    ? ((staff.firstName?.[0] || "") + (staff.lastName?.[0] || "")).toUpperCase()
                    : (name.split(" ").map(n => n[0]).join("").slice(0, 2) || "NA");

                  return (
                    <div key={id} className="selected-staff-item">
                      <div className="selected-staff-avatar" aria-hidden>
                        {initials}
                      </div>
                      <div className="selected-staff-name">{name || "Unknown Staff"}</div>
                    </div>
                  );
                })
              ) : (
                <p className="muted">No staff selected</p>
              )}
            </div>
          ) : (
            <SearchableMultiSelect
              id="staff-multi-select"
              name="staff-multi-select"
              label="Select Staff Members"
              value={selectedStaffIds}
              onChange={handleStaffSelect}
              options={allStaff.map((staff) => ({
                value: staff.id,
                label: `${staff.firstName} ${staff.lastName}`,
              }))}
              placeholder="Select staff members..."
              searchFunction={(query, options) =>
                options.filter((opt) =>
                  opt.label.toLowerCase().includes(query.toLowerCase())
                )
              }
            />
          )}
        </div>

        {/* Contact Person Section */}
        <div className="section-box">
          <h5>Contact Person</h5>
          <Select
            id="contact-person-select"
            name="contact-person-select"
            label="Select Contact Person"
            value={grantProgram.contactPerson?.id || ""}
            onChange={(e) => handleContactPersonChange(e.target.value)}
            options={selectedStaffIds.map(id => ({
              value: id,
              label: getStaffName(id)
            }))}
            required
            disabled={isReadOnly}
          />
        </div>

        {/* Assigned Staff List */}
        <div className="section-box">
          <h5>Currently Assigned Staff</h5>
          <div className="staff-list">
            {assignedStaff.map((staff) => (
              <div key={staff.staffId} className="staff-list-item">
                <div className="staff-info">
                  <div className="staff-name">
                    <p>{getStaffName(staff.staffId)}</p>
                    <p>{grantProgram.contactPerson?.id === staff.staffId && " (Contact Person)"}</p>
                  </div>
                </div>
                <div className="staff-date">
                    <p>Assigned: {new Date(staff.assignedAt).toLocaleDateString()}</p>
                </div>
                <div className="staff-controls">
                  <Select
                    id={`role-${staff.staffId}`}
                    name={`role-${staff.staffId}`}
                    value={staff.roleOnProgram}
                    onChange={(e) => handleRoleChange(staff.staffId, e.target.value as StaffRole)}
                    options={staffRoleOptions}
                    required
                    disabled={isReadOnly}
                  />
                </div>
                {canModify ? (
                  <Button
                    onClick={() => handleRemoveStaff(staff.staffId)}
                    aria-label="Remove staff member"
                    disabled={grantProgram.contactPerson?.id === staff.staffId}
                    variant="primary"
                    text="Remove"
                  />
                ) : null}
              </div>
            ))}
            {assignedStaff.length === 0 && (
              <div className="staff-list-empty">
                <p>No staff members assigned yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="section-box save-section">
          {canModify && (
            <Button
              text={isSaving ? "Saving..." : "Save Changes"}
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            />
          )}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AssignedStaff;