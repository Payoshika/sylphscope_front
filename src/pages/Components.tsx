import React, { useState } from "react";

const Components = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [progressValue, setProgressValue] = useState(65);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Example total pages

  return (
    <div className="grid">
      <div style={{ gridColumn: "2 / 12", padding: "4rem 0" }}>
        <h2>Component Design System</h2>
        <p>
          A comprehensive showcase of all available components and their
          variants.
        </p>

        {/* Typography Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Typography</h2>
          <div className="card">
            <h1>Heading 1 - Main Title</h1>
            <h2>Heading 2 - Section Title</h2>
            <h3>Heading 3 - Subsection</h3>
            <h4>Heading 4 - Content Title</h4>
            <h5>Heading 5 - Small Title</h5>
            <h6>Heading 6 - Smallest Title</h6>

            <p>
              This is a regular paragraph with <strong>bold text</strong> and{" "}
              <em>italic text</em>.
            </p>
            <p className="body-large">This is large body text for emphasis.</p>
            <p className="body-small">
              This is small body text for less important information.
            </p>
            <p className="caption">This is caption text for annotations.</p>

            <blockquote>
              "This is a blockquote example with proper styling and
              indentation."
              <cite>Author Name</cite>
            </blockquote>

            <p>
              Here's some <code>inline code</code> within a paragraph.
            </p>

            <pre>
              <code>
                {`// Code block example
const greeting = "Hello, World!";
console.log(greeting);`}
              </code>
            </pre>
          </div>
        </section>

        {/* Buttons Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Buttons</h2>
          <div className="card">
            <div className="card__header">
              <h3>Button Variants</h3>
            </div>
            <div className="card__body">
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                <button className="btn">Primary Button</button>
                <button className="btn btn--outline">Outline Button</button>
                <button className="btn btn--ghost">Ghost Button</button>
                <button className="btn" disabled>
                  Disabled Button
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                <button className="btn btn--small">Small Button</button>
                <button className="btn">Regular Button</button>
                <button className="btn btn--large">Large Button</button>
              </div>

              <button className="btn btn--full">Full Width Button</button>
            </div>
          </div>
        </section>

        {/* Form Controls Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Form Controls</h2>
          <div className="card">
            <div className="card__header">
              <h3>Input Fields</h3>
            </div>
            <div className="card__body">
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "1.4rem",
                    fontWeight: "500",
                  }}
                >
                  Regular Input
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter text here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "1.4rem",
                      fontWeight: "500",
                    }}
                  >
                    Small Input
                  </label>
                  <input
                    type="text"
                    className="input input--small"
                    placeholder="Small input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "1.4rem",
                      fontWeight: "500",
                    }}
                  >
                    Large Input
                  </label>
                  <input
                    type="text"
                    className="input input--large"
                    placeholder="Large input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "1.4rem",
                    fontWeight: "500",
                  }}
                >
                  Textarea
                </label>
                <textarea
                  className="textarea"
                  placeholder="Enter your message here..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "1.4rem",
                    fontWeight: "500",
                  }}
                >
                  Select Dropdown
                </label>
                <select
                  className="select"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <option value="">Choose an option...</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                }}
              >
                <div>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={checkboxValue}
                      onChange={(e) => setCheckboxValue(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Checkbox Option
                  </label>
                </div>
                <div>
                  <label className="radio">
                    <input
                      type="radio"
                      name="radio-group"
                      value="option1"
                      checked={radioValue === "option1"}
                      onChange={(e) => setRadioValue(e.target.value)}
                    />
                    <span className="radiomark"></span>
                    Radio Option 1
                  </label>
                  <label className="radio" style={{ marginTop: "1rem" }}>
                    <input
                      type="radio"
                      name="radio-group"
                      value="option2"
                      checked={radioValue === "option2"}
                      onChange={(e) => setRadioValue(e.target.value)}
                    />
                    <span className="radiomark"></span>
                    Radio Option 2
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Cards</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(30rem, 1fr))",
              gap: "2rem",
            }}
          >
            <div className="card">
              <div className="card__header">
                <h4>Card Title</h4>
                <p className="caption">Card subtitle or description</p>
              </div>
              <div className="card__body">
                <p>
                  This is the main content area of the card. It can contain any
                  type of content including text, images, or other components.
                </p>
              </div>
              <div className="card__footer">
                <button className="btn btn--small btn--outline">Cancel</button>
                <button className="btn btn--small">Confirm</button>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <h4>Simple Card</h4>
              </div>
              <div className="card__body">
                <p>
                  A simpler card without a footer section. Perfect for
                  displaying information or content previews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lists Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Lists</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "2rem",
            }}
          >
            <div>
              <h4>Default List</h4>
              <ul className="list">
                <li className="list__item">First list item</li>
                <li className="list__item">Second list item</li>
                <li className="list__item">Third list item</li>
                <li className="list__item">Fourth list item</li>
              </ul>
            </div>

            <div>
              <h4>Bordered List</h4>
              <ul className="list list--bordered">
                <li className="list__item">Bordered item 1</li>
                <li className="list__item">Bordered item 2</li>
                <li className="list__item">Bordered item 3</li>
                <li className="list__item">Bordered item 4</li>
              </ul>
            </div>

            <div>
              <h4>Spaced List</h4>
              <ul className="list list--spaced">
                <li className="list__item">Spaced item 1</li>
                <li className="list__item">Spaced item 2</li>
                <li className="list__item">Spaced item 3</li>
                <li className="list__item">Spaced item 4</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Badges</h2>
          <div className="card">
            <div className="card__body">
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                <span className="badge">Default Badge</span>
                <span className="badge badge--outline">Outline Badge</span>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span className="badge badge--small">Small</span>
                <span className="badge">Regular</span>
                <span className="badge badge--large">Large Badge</span>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Alerts</h2>
          <div className="alert">
            <div className="alert__title">Information Alert</div>
            <div className="alert__message">
              This is an informational message to provide context or updates to
              the user.
            </div>
          </div>

          <div className="alert">
            <div className="alert__message">
              Simple alert message without a title.
            </div>
          </div>
        </section>

        {/* Progress Bar Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Progress Bar</h2>
          <div className="card">
            <div className="card__body">
              <label
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  fontSize: "1.4rem",
                  fontWeight: "500",
                }}
              >
                Progress: {progressValue}%
              </label>
              <div className="progress">
                <div
                  className="progress__bar"
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dividers Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Dividers</h2>
          <div className="card">
            <div className="card__body">
              <p>Content above the divider</p>
              <hr className="divider" />
              <p>Content below the regular divider</p>
              <hr className="divider divider--thick" />
              <p>Content below the thick divider</p>
            </div>
          </div>
        </section>

        {/* Modal Section */}
        <section style={{ marginBottom: "6rem" }}>
          <h2>Modal</h2>
          <div className="card">
            <div className="card__body">
              <button className="btn" onClick={() => setShowModal(true)}>
                Open Modal
              </button>
            </div>
          </div>
        </section>

        {/* Modal Component */}
        {showModal && (
          <div className="modal">
            <div className="modal__content">
              <div className="modal__header">
                <h3>Modal Title</h3>
                <button
                  className="modal__close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <div style={{ marginBottom: "2rem" }}>
                <p>
                  This is the modal content. You can put any content here
                  including forms, images, or other components.
                </p>
                <p>
                  The modal has a backdrop that can be clicked to close it, and
                  includes proper focus management.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn btn--outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn" onClick={() => setShowModal(false)}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Components;
