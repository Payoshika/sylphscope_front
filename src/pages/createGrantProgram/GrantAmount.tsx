import React, { useState } from "react";
import type { GrantProgram } from "../../types/grantProgram";
import NumberInput from "../../components/inputComponents/NumberInput";
import Button from "../../components/basicComponents/Button";
import TitleAndHeadLine from "./TitleAndHeadLine";
import Select from "../../components/inputComponents/Select";

interface GrantAmountProps {
  grantProgram: GrantProgram;
  onGrantProgramChange: (updated: GrantProgram) => void;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
}

const fixedOptions = [
  { value: "fixed", label: "Fixed Amount" },
  { value: "range", label: "Range" },
];


const GrantAmount: React.FC<GrantAmountProps> = ({
  grantProgram,
  onGrantProgramChange,
  onUpdateGrant,
}) => {
  const [fixedType, setFixedType] = useState(
    grantProgram.award && grantProgram.award.length === 1 ? "fixed" : "range"
  );
  const [minAmount, setMinAmount] = useState(
    grantProgram.award && grantProgram.award.length > 0 ? grantProgram.award[0] : 0
  );
  const [maxAmount, setMaxAmount] = useState(
    grantProgram.award && grantProgram.award.length > 1 ? grantProgram.award[1] : 0
  );
  const [numOfAward, setNumOfAward] = useState(grantProgram.numOfAward ?? 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleFixedTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFixedType(e.target.value);
    if (e.target.value === "fixed") {
      setMaxAmount(minAmount);
    }
  };

  const handleMinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinAmount(value);
    if (fixedType === "fixed") setMaxAmount(value);
  };

  const handleMaxAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAmount(Number(e.target.value));
  };

  const handleNumOfAwardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumOfAward(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const award = fixedType === "fixed" ? [minAmount] : [minAmount, maxAmount];
      const updated = {
        ...grantProgram,
        award,
        numOfAward,
      };
      const response = await onUpdateGrant(grantProgram.id, updated);
      onGrantProgramChange(response.data);
      setSubmitSuccess("Grant amount saved.");
    } catch (err) {
      setSubmitError("Failed to save grant amount.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Grant Amount"
        headline="Specify the grant amount and number of awards"
        provider={true}
      />
      <form className="form-group" onSubmit={handleSubmit}>
        <Select
          id="fixed-type"
          name="fixedType"
          label="Amount Type"
          value={fixedType}
          onChange={handleFixedTypeChange}
          options={fixedOptions}
          required
        />
        <NumberInput
          id="min-amount"
          name="minAmount"
          label={fixedType === "fixed" ? "Grant Amount" : "Minimum Grant Amount"}
          value={minAmount}
          onChange={handleMinAmountChange}
          min={0}
          required
        />
        {fixedType !== "fixed" && (
          <NumberInput
            id="max-amount"
            name="maxAmount"
            label="Maximum Grant Amount"
            value={maxAmount}
            onChange={handleMaxAmountChange}
            min={minAmount}
            required
          />
        )}
        <NumberInput
          id="num-of-award"
          name="numOfAward"
          label="Number of Awards"
          value={numOfAward}
          onChange={handleNumOfAwardChange}
          min={1}
          required
        />
        <Button
          text={isSubmitting ? "Saving..." : "Save Grant Amount"}
          disabled={isSubmitting}
          type="submit"
        />
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </form>
    </div>
  );
};

export default GrantAmount;