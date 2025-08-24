import React, { useState } from "react";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import SearchableDropdown from "../../components/inputComponents/SearchableDropdown";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createNewGrantProgram } from "../../services/GrantProgramService";
import { duplicateGrantProgram } from "../../services/GrantProgramService";
import type { GrantProgram, StaffRole } from "../../types/grantProgram";
import type { Provider } from "../../types/provider";
import type { ProviderStaff } from "../../types/user";

interface GrantOption {
  id: string;
  title: string;
  description: string;
  year: string;
}

// keep a small fallback for local/testing, but prefer passed-in grantPrograms
const mockPastGrants: GrantOption[] = [
  { id: "local-1", title: "Local Sample Grant A", description: "Fallback grant", year: "2023" },
  { id: "local-2", title: "Local Sample Grant B", description: "Fallback grant", year: "2022" },
];

interface CreateGrantProps {
  grantPrograms?: GrantProgram[];
}

const CreateGrant: React.FC<CreateGrantProps> = ({ grantPrograms = [] }) => {
  const [selectedOption, setSelectedOption] = useState<"duplicate" | null>(null);
  const [selectedGrantToDuplicate, setSelectedGrantToDuplicate] = useState("");
  const [isDuplicating, setIsDuplicating] = useState(false);
  const navigate = useNavigate();
  const { provider, providerStaff } = useOutletContext<{ provider: Provider; providerStaff: ProviderStaff;}>();

  // Only Manager or Administrator can create/duplicate grants
  const isEditor =
    !!providerStaff &&
    ["MANAGER", "ADMINISTRATOR"].includes((providerStaff.role || "").toString().toUpperCase());

  const ensureEditor = (): boolean => {
    if (!isEditor) {
      alert("Only Manager or Administrator can create or duplicate grants.");
      return false;
    }
    return true;
  };

  const handleCreateNew = async () => {
    if (!ensureEditor()) return;
    try {
      // Create a new grant program with initial values
      const newGrantProgram: Omit<GrantProgram, 'id' | 'createdAt' | 'updatedAt'> = {
        title: '',
        description: '',
        providerId: provider.id,
        providerName: provider.organisationName,
        status: 'DRAFT',
        schedule: {
          applicationStartDate: null,
          applicationEndDate: null,
          decisionDate: null,
          fundDisbursementDate: null
        },
        assignedStaffIds: [],
        contactPerson: {
          id: providerStaff.id,
          userId:"",
          providerId: provider.id,
          firstName: providerStaff.firstName,
          lastName: providerStaff.lastName,
          role: providerStaff.role as StaffRole,
        },
        questionIds: [],
        questionGroupsIds: [],
        selectionCriteria: [],
        evaluationScale: 'HUNDRED'
      };
      const createdProgram = await createNewGrantProgram(providerStaff.id, newGrantProgram);
      console.log("createdProgram is ")
      console.log(createdProgram);
      navigate(`/create-grant/${createdProgram.id}`);
    } catch (error) {
      console.error('Failed to create new grant program:', error);
      alert('Failed to create new grant program. Please try again.');
    }
  };

  const handleDuplicate = async () => {
    if (!ensureEditor()) return;
    if (!selectedGrantToDuplicate) return;
    try {
      setIsDuplicating(true);
      const created = await duplicateGrantProgram(
        selectedGrantToDuplicate,
        provider.id,
        providerStaff.id
      );
      // navigate to the create-grant flow for the duplicated program
      navigate(`/create-grant/${created.id}`);
    } catch (err) {
      console.error("Failed to duplicate grant program:", err);
      alert("Failed to duplicate grant program. Please try again.");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleOptionSelect = (option: "duplicate") => {
    if (!isEditor) {
      // still allow toggling UI for admins/managers only
      alert("Only Manager or Administrator can duplicate grants.");
      return;
    }
    setSelectedOption(option);
  };
 
  return (
    <div className="content">
      <TitleAndHeadLine
        title="Create Grant"
        headline="Choose how you want to create your grant program"
        provider={true}
      />
      
      {!isEditor && (
        <div className="read-only-notice" style={{ marginBottom: 16 }}>
          <p>Only users with the Manager or Administrator role can create or duplicate grant programs.</p>
        </div>
      )}
      
      <div className="create-grant-options">
        {/* Create New Option */}
        <div className="create-grant-option">
          <div className="create-grant-option-header">
            <h3>Create New Grant</h3>
            <p>Start from scratch and create a completely new grant program</p>
          </div>
          <div className="create-grant-option-content">
            <Button
              text="Create New Grant"
              variant="primary"
              onClick={handleCreateNew}
              disabled={!isEditor}
              size="regular"
            />
          </div>
        </div>

        {/* Duplicate Option */}
        <div className={`create-grant-option${selectedOption === "duplicate" ? " selected" : ""}`}>
          <div className="create-grant-option-header">
            <h3>Duplicate Past Grant</h3>
            <p>Use an existing grant as a template to create a new one</p>
          </div>
          <div className="create-grant-option-content">
            <Button
              text="Duplicate Past Grant"
              variant={selectedOption === "duplicate" ? "primary" : "outline"}
              onClick={() => handleOptionSelect("duplicate")}
              disabled={!isEditor}
              size="regular"
            />
            {selectedOption === "duplicate" && (
              <div className="create-grant-duplicate-section">
                <SearchableDropdown
                  id="grant-duplicate-select"
                  name="grant-duplicate-select"
                  label="Select Grant to Duplicate"
                  value={selectedGrantToDuplicate}
                  onChange={setSelectedGrantToDuplicate}
                  // prefer incoming grantPrograms; fall back to mockPastGrants
                  options={(grantPrograms.length > 0 ? grantPrograms : mockPastGrants).map(grant => ({
                    value: grant.id,
                    label: grant.title
                  }))}
                  placeholder="Search and select a grant to duplicate..."
                  required
                  searchFunction={(query, options) =>
                    options.filter(opt =>
                      opt.label.toLowerCase().includes(query.toLowerCase())
                    )
                  }
                />
                <div className="create-grant-action">
                  <Button
                    text="Continue to Duplicate"
                    variant="primary"
                    onClick={handleDuplicate}
                    disabled={!isEditor || !selectedGrantToDuplicate || isDuplicating}
                    text={isDuplicating ? "Duplicating..." : "Continue to Duplicate"}
                    size="regular"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGrant;