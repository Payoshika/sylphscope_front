import React, { useState } from "react";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import SearchableDropdown from "../../components/inputComponents/SearchableDropdown";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createNewGrantProgram } from "../../services/GrantProgramService";
import type { GrantProgram, StaffRole } from "../../types/grantProgram";
import type { Provider } from "../../types/provider";
import type { ProviderStaff } from "../../types/user";
 
interface GrantOption {
  id: string;
  title: string;
  description: string;
  year: string;
}


const mockPastGrants: GrantOption[] = [
  { id: "1", title: "Engineering Scholarship 2023", description: "Annual engineering scholarship for undergraduate students", year: "2023" },
  { id: "2", title: "Computer Science Grant", description: "Grant for computer science students with financial need", year: "2023" },
  { id: "3", title: "Mathematics Award", description: "Award for outstanding mathematics students", year: "2022" },
  { id: "4", title: "Physics Research Grant", description: "Research grant for physics students", year: "2022" },
  { id: "5", title: "Chemistry Innovation Award", description: "Award for innovative chemistry projects", year: "2021" },
];

const CreateGrant: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"duplicate" | null>(null);
  const [selectedGrantToDuplicate, setSelectedGrantToDuplicate] = useState("");
  const navigate = useNavigate();
  const { provider, providerStaff} = useOutletContext<{ provider: Provider; providerStaff: ProviderStaff;}>();
  const handleCreateNew = async () => {
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

  const handleDuplicate = () => {
    if (selectedGrantToDuplicate) {
      navigate(`/create-grant/duplicate/${selectedGrantToDuplicate}`);
    }
  };

  const handleOptionSelect = (option: "duplicate") => {
    setSelectedOption(option);
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Create Grant"
        headline="Choose how you want to create your grant program"
        provider={true}
      />
      
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
                  options={mockPastGrants.map(grant => ({ 
                    value: grant.id, 
                    label: `${grant.title} (${grant.year})` 
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
                    disabled={!selectedGrantToDuplicate}
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