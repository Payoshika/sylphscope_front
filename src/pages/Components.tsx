import React, { useState } from "react";
import Button from "../components/basicComponents/Button";
import Textarea from "../components/inputComponents/Textarea";
import Select from "../components/inputComponents/Select";
import Checkbox from "../components/inputComponents/Checkbox";
import Radio from "../components/inputComponents/Radio";
import SearchableDropdown from "../components/inputComponents/SearchableDropdown";
import Email from "../components/inputComponents/Email";
import Password from "../components/inputComponents/Password";
import TextInput from "../components/inputComponents/TextInput";
import Card from "../components/basicComponents/Card";
import List from "../components/basicComponents/List";
import Badge from "../components/basicComponents/Badge";
import Alert from "../components/basicComponents/Alert";
import ProgressBar from "../components/basicComponents/ProgressBar";
import Modal from "../components/basicComponents/Modal";
import Religion from "../components/inputComponents/personalInfo/Religion";
import Ethnicity from "../components/inputComponents/personalInfo/Ethnicity";
import Gender from "../components/inputComponents/personalInfo/Gender";
import TuitionfeeStatus, {
  type TuitionfeeStatusValue,
} from "../components/inputComponents/personalInfo/TuitionfeeStatus";
import YesNo, { type YesNoValue } from "../components/inputComponents/YesNo";

import {
  DOBPicker,
  AnyDatePicker as DatePicker,
  MonthPicker,
  type DateValue,
  type MonthValue,
} from "../components/inputComponents/datePickers";
import Country from "../components/inputComponents/personalInfo/Country";
import type { CountryType } from "../data/countries";
import PhoneNumber from "../components/inputComponents/Phonenumber";
import Address, {
  type AddressValue,
} from "../components/inputComponents/Address";
import University from "../components/inputComponents/academicComponents/University";
import UniversityMajor, {
  type UniversityMajorValue,
} from "../components/inputComponents/academicComponents/UniversityMajor";

// Import individual grade components
// Fixed imports - separate component imports from type imports
import GCSEGrade from "../components/inputComponents/academicComponents/GCSEGrade";
import ALevelGrade from "../components/inputComponents/academicComponents/ALevelGrade";
import GPAGrade from "../components/inputComponents/academicComponents/GPAGrade";
import UKUniversityGradeInput from "../components/inputComponents/academicComponents/UKUniversityGradeInput";
// Type-only imports
import type { GCSEGradeValue } from "../components/inputComponents/academicComponents/GCSEGrade";
import type { ALevelGradeValue } from "../components/inputComponents/academicComponents/ALevelGrade";
import type { GPAGradeValue } from "../components/inputComponents/academicComponents/GPAGrade";
import type { UKUniversityGradeValue } from "../components/inputComponents/academicComponents/UKUniversityGradeInput";

const Components = () => {
  // State for interactive components
  const [yesNoRadio, setYesNoRadio] = useState<YesNoValue>("");
  const [yesNoToggle, setYesNoToggle] = useState<YesNoValue>("");
  const [yesNoButtons, setYesNoButtons] = useState<YesNoValue>("");
  const [isYesNoValid, setIsYesNoValid] = useState(false);
  const [termsAgreement, setTermsAgreement] = useState<YesNoValue>("");

  const [selectedCountry, setSelectedCountry] = useState<string>("GB");
  const [isCountryValid, setIsCountryValid] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [religion, setReligion] = useState("");
  const [isReligionValid, setIsReligionValid] = useState(false);
  const [ethnicity, setEthnicity] = useState("");
  const [isEthnicityValid, setIsEthnicityValid] = useState(false);
  const [gender, setGender] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [isGenderValid, setIsGenderValid] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState({
    countryCode: "GB",
    number: "",
  });
  const [address, setAddress] = useState<AddressValue>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
  });
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [progressValue, setProgressValue] = useState(65);
  const [showModal, setShowModal] = useState(false);
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [isDateValid, setIsDateValid] = useState(false);
  // New date picker states
  const [dobDate, setDobDate] = useState<DateValue>({
    day: "",
    month: "",
    year: "",
  });
  const [isDobValid, setIsDobValid] = useState(false);

  const [futureDate, setFutureDate] = useState<DateValue>({
    day: "",
    month: "",
    year: "",
  });
  const [isFutureDateValid, setIsFutureDateValid] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState<MonthValue>({
    month: "",
    year: "",
  });
  const [isMonthValid, setIsMonthValid] = useState(false);
  const [university, setUniversity] = useState("");
  const [isUniversityValid, setIsUniversityValid] = useState(false);
  const [universityMajor, setUniversityMajor] = useState<UniversityMajorValue>({
    degreeName: "",
    level: "",
    category: "",
  });
  const [isUniversityMajorValid, setIsUniversityMajorValid] = useState(false);
  const [tuitionFeeStatus, setTuitionFeeStatus] =
    useState<TuitionfeeStatusValue>("");
  const [isTuitionFeeStatusValid, setIsTuitionFeeStatusValid] = useState(false);

  // Individual grade component states
  const [gcseGrade, setGcseGrade] = useState<GCSEGradeValue>({
    subject: "",
    grade: "",
  });
  const [isGcseGradeValid, setIsGcseGradeValid] = useState(false);
  const [alevelGrade, setAlevelGrade] = useState<ALevelGradeValue>({
    subject: "",
    grade: "",
  });
  const [isAlevelGradeValid, setIsAlevelGradeValid] = useState(false);

  const [gpaGrade, setGpaGrade] = useState<GPAGradeValue>({
    gpaValue: "",
    gpaScale: "",
  });
  const [isGpaGradeValid, setIsGpaGradeValid] = useState(false);

  const [ukUniversityGrade, setUkUniversityGrade] =
    useState<UKUniversityGradeValue>({
      category: "honours",
      grade: "",
    });
  const [isUkUniversityGradeValid, setIsUkUniversityGradeValid] =
    useState(false);

  // Configuration data
  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const listItems = [
    "First list item",
    "Second list item",
    "Third list item",
    "Fourth list item",
  ];

  return (
    <div className="grid">
      <div className="component-showcase">
        {/* Buttons Section */}
        <section className="component-section">
          <h2>Buttons</h2>
          <Card title="Button Variants">
            <div className="button-grid">
              <Button text="Primary Button" />
              <Button text="Outline Button" variant="outline" />
              <Button text="Ghost Button" variant="ghost" />
              <Button text="Disabled Button" disabled />
              <Button text="Small Button" size="small" />
              <Button text="Large Button" size="large" />
            </div>
          </Card>
          <h2>Radio Components</h2>
          <div className="component-section">
            <Card title="Enhanced Radio Components">
              <div className="radio-group">
                <Radio
                  id="radio-default-1"
                  name="radioDefault"
                  value="option1"
                  label="Default Radio Option 1"
                  checked={radioValue === "option1"}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <Radio
                  id="radio-default-2"
                  name="radioDefault"
                  value="option2"
                  label="Default Radio Option 2"
                  description="Description can be added"
                  checked={radioValue === "option2"}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
              </div>
            </Card>
          </div>
          <Religion
            id="religion"
            name="religion"
            label="Religion"
            searchable={true}
            showCategories={true}
            placeholder="Find your religion"
            value={religion}
            onChange={setReligion}
            required
            onValidationChange={(isValid, errorMessage) => {
              setIsReligionValid(isValid);
              console.log("Religion validation:", isValid, errorMessage);
            }}
          />
          <Ethnicity
            id="ethnicity"
            name="ethnicity"
            label="Ethnicity"
            searchable={true}
            showCategories={true}
            placeholder="Search and select your ethnicity"
            value={ethnicity}
            onChange={setEthnicity}
            required
            onValidationChange={(isValid, errorMessage) => {
              setIsEthnicityValid(isValid);
              console.log("Ethnicity validation:", isValid, errorMessage);
            }}
          />
          <Gender
            id="gender"
            name="gender"
            label="Gender Identity"
            value={gender}
            onChange={setGender}
            customValue={customGender}
            onCustomChange={setCustomGender}
            required
            searchable
            showCategories
            allowCustomInput
            placeholder="Search and select your gender identity"
            onValidationChange={(isValid, errorMessage) => {
              setIsGenderValid(isValid);
              console.log("Gender validation:", isValid, errorMessage);
            }}
          />
          <TuitionfeeStatus
            id="tuition-fee-status"
            name="tuitionFeeStatus"
            label="Tuition Fee Status"
            value={tuitionFeeStatus}
            onChange={setTuitionFeeStatus}
            required
            onValidationChange={(isValid, errorMessage) => {
              setIsTuitionFeeStatusValid(isValid);
              console.log(
                "Tuition fee status validation:",
                isValid,
                errorMessage
              );
            }}
          />
        </section>

        <section className="component-section">
          <h2>Yes/No Components</h2>
          <Card title="Yes/No Variants">
            <YesNo
              id="terms-agreement"
              name="termsAgreement"
              label="Terms and Conditions"
              question="Do you agree to our Terms and Conditions?"
              value={termsAgreement}
              onChange={setTermsAgreement}
              required
              yesLabel="I Agree"
              noLabel="I Decline"
              helpText="By agreeing, you accept our terms of service and privacy policy."
              onValidationChange={(isValid, errorMessage) => {
                console.log("Terms validation:", isValid, errorMessage);
              }}
            />
          </Card>
        </section>

        {/* Date Pickers Section */}
        <section className="component-section">
          <h2>Date Pickers</h2>

          <Card title="Date of Birth Picker">
            <DOBPicker
              id="dob-picker"
              name="dobPicker"
              label="Date of Birth"
              value={dobDate}
              onChange={setDobDate}
              validation={{
                required: true,
                minAge: 13,
                maxAge: 120,
              }}
              onValidationChange={(isValid, errorMessage) => {
                setIsDobValid(isValid);
                console.log("DOB validation:", isValid, errorMessage);
              }}
            />
          </Card>

          <Card title="Any Date Picker">
            <DatePicker
              id="any-date-picker"
              name="anyDatePicker"
              label="Select Any Date"
              type="any"
              value={futureDate}
              onChange={setFutureDate}
              validation={{
                required: true,
              }}
              onValidationChange={(isValid, errorMessage) => {
                setIsFutureDateValid(isValid);
                console.log("Any date validation:", isValid, errorMessage);
              }}
            />
          </Card>

          <Card title="Future Date Only">
            <DatePicker
              id="future-only-picker"
              name="futureOnlyPicker"
              label="Select Future Date Only"
              value={futureDate}
              onChange={setFutureDate}
              type="future"
              validation={{
                required: true,
              }}
              onValidationChange={(isValid, errorMessage) => {
                setIsFutureDateValid(isValid);
                console.log("Future date validation:", isValid, errorMessage);
              }}
            />
          </Card>

          <Card title="Month Picker">
            <MonthPicker
              id="month-picker"
              name="monthPicker"
              label="Select Month & Year"
              value={selectedMonth}
              onChange={setSelectedMonth}
              type="any" // or 'past' or 'any'
              validation={{
                required: true,
              }}
              onValidationChange={(isValid, errorMessage) => {
                setIsMonthValid(isValid);
                console.log("Month validation:", isValid, errorMessage);
              }}
            />
          </Card>
        </section>

        {/* Form Controls Section */}
        <section className="component-section">
          <h2>Form Controls</h2>
          <Card title="Basic Input Fields">
            <Country
              id="citizenship"
              name="citizenship"
              label="Country of Citizenship"
              value={selectedCountry}
              onChange={setSelectedCountry}
              required
              searchable
              showFlag
              onValidationChange={(isValid, errorMessage) => {
                setIsCountryValid(isValid);
              }}
            />
            <Address
              id="address"
              name="address"
              label="Address"
              value={address}
              onChange={setAddress}
              countryCode={selectedCountry}
              required
              onValidationChange={(isValid, errorMessage) => {
                setIsAddressValid(isValid);
                console.log("Address validation:", isValid, errorMessage);
              }}
            />
            <TextInput
              id="textInput"
              name="textInput"
              label="Text Input"
              placeholder="Enter text here..."
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
            />

            <Email
              id="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              required
              onValidationChange={(isValid, errorMessage) => {
                setIsEmailValid(isValid);
              }}
            />

            <Password
              id="password"
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              autoComplete="new-password"
              required
            />
            <PhoneNumber
              id="phone"
              name="phone"
              label="Phone Number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              required
            />

            <Textarea
              id="textarea1"
              name="message"
              label="Textarea"
              placeholder="Enter your message here..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />

            <Select
              id="select1"
              name="dropdown"
              label="Select Dropdown"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={selectOptions}
            />

            <div className="form-group">
              <Checkbox
                id="checkbox1"
                name="checkboxOption"
                label="Checkbox Option"
                checked={checkboxValue}
                onChange={(e) => setCheckboxValue(e.target.checked)}
              />
            </div>
            <University
              id="university"
              name="university"
              label="University"
              value={university}
              onChange={setUniversity}
              required
              placeholder="Type at least 4 characters to search..."
              onValidationChange={(isValid, errorMessage) => {
                setIsUniversityValid(isValid);
                console.log("University validation:", isValid, errorMessage);
              }}
            />
            <UniversityMajor
              id="university-major"
              name="universityMajor"
              label="University Degree"
              value={universityMajor}
              onChange={setUniversityMajor}
              onValidationChange={(isValid, errorMessage) => {
                setIsUniversityMajorValid(isValid);
                console.log(
                  "University major validation:",
                  isValid,
                  errorMessage
                );
              }}
            />
          </Card>
        </section>

        {/* Academic Grades Section */}
        <section className="component-section">
          <h2>Academic Grades</h2>

          {/* Individual Grade Components */}
          <Card title="Individual Grade Components">
            <GCSEGrade
              id="gcse-grade"
              name="gcseGrade"
              label="GCSE Grade"
              value={gcseGrade}
              onChange={setGcseGrade}
              onValidationChange={(isValid, errorMessage) => {
                setIsGcseGradeValid(isValid);
              }}
            />

            <ALevelGrade
              id="alevel-grade"
              name="alevelGrade"
              label="A-Level Grade"
              value={alevelGrade}
              onChange={setAlevelGrade}
              showUCASPoints={true}
              onValidationChange={(isValid, errorMessage) => {
                setIsAlevelGradeValid(isValid);
                console.log("A-Level grade validation:", isValid, errorMessage);
              }}
            />

            <UKUniversityGradeInput
              id="uk-university-grade"
              name="ukUniversityGrade"
              label="UK University Grade"
              value={ukUniversityGrade}
              onChange={setUkUniversityGrade}
              onValidationChange={(isValid, errorMessage) => {
                setIsUkUniversityGradeValid(isValid);
                console.log(
                  "UK University grade validation:",
                  isValid,
                  errorMessage
                );
              }}
            />

            <GPAGrade
              id="gpa-grade"
              name="gpaGrade"
              label="GPA Grade"
              value={gpaGrade}
              onChange={setGpaGrade}
              onValidationChange={(isValid, errorMessage) => {
                setIsGpaGradeValid(isValid);
                console.log("GPA grade validation:", isValid, errorMessage);
              }}
            />
          </Card>
        </section>

        {/* Cards Section */}
        <section className="component-section">
          <h2>Cards</h2>
          <div className="card-grid">
            <Card
              title="Card Title"
              subtitle="Card subtitle or description"
              footer={
                <>
                  <Button text="Cancel" variant="outline" size="small" />
                  <Button text="Confirm" size="small" />
                </>
              }
            >
              This is the main content area of the card. It can contain any type
              of content.
            </Card>

            <Card title="Simple Card">
              A simpler card without a footer section. Perfect for displaying
              information.
            </Card>
          </div>
        </section>

        {/* Lists Section */}
        <section className="component-section">
          <h2>Lists</h2>
          <div className="list-grid">
            <div>
              <h4>Default List</h4>
              <List items={listItems} />
            </div>
            <div>
              <h4>Bordered List</h4>
              <List items={listItems} variant="bordered" />
            </div>
            <div>
              <h4>Spaced List</h4>
              <List items={listItems} variant="spaced" />
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="component-section">
          <h2>Badges</h2>
          <Card>
            <div className="badge-container">
              <Badge text="Default Badge" />
              <Badge text="Outline Badge" variant="outline" />
              <Badge text="Small" size="small" />
              <Badge text="Large Badge" size="large" />
            </div>
          </Card>
        </section>

        {/* Alerts Section */}
        <section className="component-section">
          <h2>Alerts</h2>
          <Alert
            title="Information Alert"
            message="This is an informational message to provide context or updates to the user."
            type="info"
          />
          <Alert message="Simple alert message without a title." />
        </section>

        {/* Progress Bar Section */}
        <section className="component-section">
          <h2>Progress Bar</h2>
          <Card>
            <ProgressBar value={progressValue} />
            <div className="progress-controls">
              <input
                type="range"
                min="0"
                max="100"
                value={progressValue}
                onChange={(e) => setProgressValue(parseInt(e.target.value))}
                className="slider"
              />
            </div>
          </Card>
        </section>

        {/* Modal Section */}
        <section className="component-section">
          <h2>Modal</h2>
          <Card>
            <Button text="Open Modal" onClick={() => setShowModal(true)} />
          </Card>
        </section>

        {/* Modal Component */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal Title"
          actions={
            <>
              <Button
                text="Cancel"
                variant="outline"
                onClick={() => setShowModal(false)}
              />
              <Button text="Confirm" onClick={() => setShowModal(false)} />
            </>
          }
        >
          <h2>
            This is the modal content. You can put any content here including
            forms, images, or other components.
          </h2>
          <p>
            The modal has a backdrop that can be clicked to close it, and
            includes proper focus management.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Components;
