import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProviderStaff, StaffRole } from "../../types/user";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import Select from "../../components/inputComponents/Select";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

const staffRoleOptions = [
  { value: "manager", label: "Manager" },
  { value: "administrator", label: "Administrator" },
  { value: "assessor", label: "Assessor" },
  { value: "volunteer", label: "Volunteer" },
];

const StaffProfile: React.FC = () => {
  const { providerStaff } = useOutletContext<{ 
    providerStaff: ProviderStaff;
  }>();

  const [staffForm, setStaffForm] = useState<ProviderStaff>(providerStaff);

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
    
    // Here you would call your API to update staff profile
    // const staffResponse = await updateProviderStaff(staffForm);
    
    alert("Staff profile updated!");
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Staff Profile"
        headline="Manage your staff information"
        provider={true}
      />
      <form className="form-group" onSubmit={handleSubmit}>
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
        <Button text="Save Profile" type="submit" />
      </form>
    </div>
  );
};

export default StaffProfile;
