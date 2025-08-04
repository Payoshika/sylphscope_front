import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProviderStaff, StaffRole } from "../../types/user";
import { updateStaffProfile } from "../../services/ProviderService";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import Select from "../../components/inputComponents/Select";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

const staffRoleOptions = [
  { value: "Manager", label: "Manager" },
  { value: "Administrator", label: "Administrator" },
  { value: "Assessor", label: "Assessor" },
  { value: "Volunteer", label: "Volunteer" },
];

const StaffProfile: React.FC = () => {
  const { providerStaff } = useOutletContext<{ 
    providerStaff: ProviderStaff;
  }>();

  console.log("providerStaff", providerStaff);

  const [staffForm, setStaffForm] = useState<ProviderStaff>(providerStaff);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Handle staff input changes
  const handleStaffChange = (field: keyof ProviderStaff, value: any) => {
    setStaffForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle submit (update profile)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    try {
      const updatedStaff = await updateStaffProfile(staffForm);
      setStaffForm(updatedStaff);
      setSubmitSuccess("Staff profile updated successfully!");
    } catch (error) {
      console.error("Failed to update staff profile:", error);
      setSubmitError("Failed to update staff profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="My Profile"
        headline="Manage your profile information"
        provider={true}
      />
      
      {submitError && (
        <div className="error-message">
          <p>{submitError}</p>
        </div>
      )}
      
      {submitSuccess && (
        <div className="success-message">
          <p>{submitSuccess}</p>
        </div>
      )}
      
      <form className="form-group staff-profile-form" onSubmit={handleSubmit}>
        <TextInput
          id="firstName"
          name="firstName"
          label="First Name"
          value={staffForm.firstName}
          onChange={(e) => handleStaffChange("firstName", e.target.value)}
          required
        />
        <TextInput
          id="middleName"
          name="middleName"
          label="Middle Name"
          value={staffForm.middleName || ""}
          onChange={(e) => handleStaffChange("middleName", e.target.value)}
        />
        <TextInput
          id="lastName"
          name="lastName"
          label="Last Name"
          value={staffForm.lastName}
          onChange={(e) => handleStaffChange("lastName", e.target.value)}
          required
        />
        <Select
          id="role"
          name="role"
          label="Role"
          value={staffForm.role || "manager"}
          onChange={(e) => handleStaffChange("role", e.target.value as StaffRole)}
          options={staffRoleOptions}
          required
        />
        <Button 
          text={isSubmitting ? "Saving..." : "Save Profile"} 
          type="submit" 
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};

export default StaffProfile;
