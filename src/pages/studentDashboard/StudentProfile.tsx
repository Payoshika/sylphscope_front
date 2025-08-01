import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Student } from "../../types/student";
import TextInput from "../../components/inputComponents/TextInput";
import { countries } from "../../data/countries";
import Button from "../../components/basicComponents/Button";
import Select from "../../components/inputComponents/Select";
import SearchableMultiSelect from "../../components/inputComponents/SearchableMultiSelect";
import type { Gender } from "../../types/gender";
import DOBPicker from "../../components/inputComponents/datePickers/DOBPicker";
import { toDateValue } from "../../components/inputComponents/datePickers/utils";
import type { DateValue } from "../../components/inputComponents/datePickers/types";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Non-Binary", label: "Non-Binary" },
    { value: "Genderfluid", label: "Genderfluid" },
    { value: "Genderqueer", label: "Genderqueer" },
    { value: "Agender", label: "Agender" },
    { value: "Bigender", label: "Bigender" },
    { value: "Demigender", label: "Demigender" },
    { value: "Pangender", label: "Pangender" },
    { value: "Two-Spirit", label: "Two-Spirit" },
    { value: "Transgender Male", label: "Transgender Male" },
    { value: "Transgender Female", label: "Transgender Female" },
    { value: "Questioning", label: "Questioning" },
    { value: "Prefer Not to Say", label: "Prefer Not to Say" },
    { value: "Self-Describe", label: "Self-Describe" },
    { value: "Other", label: "Other" },
];

const countryOptions = countries.map((country) => ({
  value: country.code,
  label: country.name,
  flag: country.flag,
  phoneCode: country.phoneCode,
}));

const searchCountriesFunction = (query: string, options: typeof countryOptions) => {
  if (!query.trim()) return options;
  const searchTerm = query.toLowerCase().trim();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm) ||
      option.value.toLowerCase().includes(searchTerm) ||
      (option.phoneCode && option.phoneCode.includes(searchTerm))
  );
};

interface StudentProfileProps {
  student: Student;
  updateStudent: (student: Student) => Promise<Student>;
}

const StudentProfile: React.FC<StudentProfileProps> = () => {
const { student, setStudent, updateStudent } = useOutletContext<{
  student: Student;
  setStudent: (s: Student) => void;
  updateStudent: (s: Student) => Promise<Student>;
}>();
const [form, setForm] = useState<Student>(student);
  
  const initialDob: DateValue =
  typeof student.dateOfBirth === "object"
    ? student.dateOfBirth
    : toDateValue(student.dateOfBirth);

  const [dob, setDob] = useState<DateValue>(initialDob);

  // Sync dob to form
    const handleDobChange = (value: DateValue) => {
    setDob(value);
    const formatted =
        value.year && value.month && value.day
        ? `${value.year}-${value.month}-${value.day}`
        : "";
    setForm((prev) => ({
        ...prev,
        dateOfBirth: formatted,
    }));
    };
  // Handle input changes
  const handleChange = (field: keyof Student, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function toCountryValue(country: any): Country {
  if (
    country &&
    typeof country === "object" &&
    "code" in country &&
    "name" in country &&
    "flag" in country &&
    "phoneCode" in country
  ) {
    return country as Country;
  }
  return { code: "", name: "", flag: "", phoneCode: "" };
}

  // Handle submit (update profile)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      addressCountry: form.addressCountry?.code || "",
      citizenshipCountry: Array.isArray(form.citizenshipCountry)
        ? form.citizenshipCountry.map((c) => c.code)
        : [form.citizenshipCountry?.code || ""],
    };
    const response = await updateStudent(payload);
    setStudent(response);
    alert("Profile updated!");
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Student Profile"
        headline="Create your basic profile before apply any grant"
        student={true}
      />
      <form className="form-group" onSubmit={handleSubmit}>
        <TextInput
          id="firstName"
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
        <TextInput
          id="middleName"
          name="middleName"
          label="Middle Name"
          value={form.middleName}
          onChange={(e) => handleChange("middleName", e.target.value)}
        />
        <TextInput
          id="lastName"
          name="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
        />
        <DOBPicker
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of Birth"
          value={dob}   
          onChange={handleDobChange}
          validation={{
            required: true,
            minAge: 13,
            maxAge: 100,
          }}
        />
        <Select
          id="addressCountry"
          name="addressCountry"
          label="Address Country"
        value={form.addressCountry?.code || ""}
        onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedCountry = countries.find(c => c.code === selectedCode);
            handleChange("addressCountry", selectedCountry || { code: "", name: "", flag: "", phoneCode: "" });
        }}
        options={countryOptions}
          required
        />
        <TextInput
          id="addressState"
          name="addressState"
          label="Address State"
          value={form.addressState}
          onChange={(e) => handleChange("addressState", e.target.value)}
        />
        <TextInput
          id="addressCity"
          name="addressCity"
          label="Address City"
          value={form.addressCity}
          onChange={(e) => handleChange("addressCity", e.target.value)}
        />
        <TextInput
          id="addressElse"
          name="addressElse"
          label="Address (Other)"
          value={form.addressElse}
          onChange={(e) => handleChange("addressElse", e.target.value)}
        />
        <TextInput
          id="profilePictureUrl"
          name="profilePictureUrl"
          label="Profile Picture URL"
          value={form.profilePictureUrl}
          onChange={(e) => handleChange("profilePictureUrl", e.target.value)}
        />
        <TextInput
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          value={form.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
        <SearchableMultiSelect
          id="citizenshipCountry"
          name="citizenshipCountry"
          label="Citizenship Country"
          value={
            Array.isArray(form.citizenshipCountry)
              ? form.citizenshipCountry.map((c) => c.code)
              : [form.citizenshipCountry?.code || ""]
          }
          onChange={(selectedCodes) => {
            const selectedCountries = selectedCodes
              .map((code: string) => countries.find((c) => c.code === code))
              .filter(Boolean);
            handleChange("citizenshipCountry", selectedCountries);
          }}
          options={countryOptions}
          searchFunction={searchCountriesFunction}
          required
          placeholder="Search and select citizenship countries"
        />
    <Select
          id="gender"
          name="gender"
          label="Gender"
          value={form.gender || ""}
          onChange={(e) => {
            handleChange("gender", e.target.value);
          }}
          options={genderOptions}
          required
        />
        <Button text="Save Profile" type="submit" />
      </form>
    </div>
  );
};

export default StudentProfile;