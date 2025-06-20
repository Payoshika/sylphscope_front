import React, { useState } from "react";
import Button from "../components/basicComponents/Button";
import Input from "../components/inputComponents/Input";
import Textarea from "../components/inputComponents/Textarea";
import Select from "../components/inputComponents/Select";
import Checkbox from "../components/inputComponents/Checkbox";
import Radio from "../components/inputComponents/Radio";
import Card from "../components/basicComponents/Card";
import List from "../components/basicComponents/List";
import Badge from "../components/basicComponents/Badge";
import Alert from "../components/basicComponents/Alert";
import ProgressBar from "../components/basicComponents/ProgressBar";
import Modal from "../components/basicComponents/Modal";
import DatePicker from "../components/inputComponents/DatePicker";

const Components = () => {
  // State for interactive components
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
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
              <Button text="Full Width Button" fullWidth />
            </div>
          </Card>
        </section>

        {/* Form Controls Section */}
        <section className="component-section">
          <h2>Form Controls</h2>
          <Card title="Input Fields">
            <Input
              id="text1"
              name="textInput"
              label="Regular Input"
              placeholder="Enter text here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="form-row">
              <Input
                id="text2"
                name="smallInput"
                label="Small Input"
                placeholder="Small input"
                value=""
                onChange={() => {}}
                size="small"
              />
              <Input
                id="text3"
                name="largeInput"
                label="Large Input"
                placeholder="Large input"
                value=""
                onChange={() => {}}
                size="large"
              />
            </div>

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

            <div className="form-row">
              <Checkbox
                id="checkbox1"
                name="checkboxOption"
                label="Checkbox Option"
                checked={checkboxValue}
                onChange={(e) => setCheckboxValue(e.target.checked)}
              />

              <div>
                <Radio
                  id="radio1"
                  name="radioGroup"
                  value="option1"
                  label="Radio Option 1"
                  checked={radioValue === "option1"}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <Radio
                  id="radio2"
                  name="radioGroup"
                  value="option2"
                  label="Radio Option 2"
                  checked={radioValue === "option2"}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
              </div>
            </div>

            <DatePicker
              id="birth-date"
              name="birthDate"
              label="Date of Birth"
              value={birthDate}
              onChange={setBirthDate}
              validation={{
                required: true,
                minAge: 13,
                maxAge: 120,
              }}
              onValidationChange={(isValid, errorMessage) => {
                setIsDateValid(isValid);
                console.log("Date validation:", isValid, errorMessage);
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
