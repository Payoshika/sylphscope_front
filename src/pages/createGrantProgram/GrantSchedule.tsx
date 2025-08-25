import React, { useState, useEffect, useCallback } from "react";
import type { GrantProgram } from "../../types/grantProgram";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import DatePicker from "../../components/inputComponents/datePickers/DatePicker";
import type { DateValue } from "../../components/inputComponents/datePickers/types";
import { updateGrantProgramSchedule } from "../../services/GrantProgramService";
import { toDateValue } from "../../components/inputComponents/datePickers/utils";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { ProviderStaff } from "../../types/user";
import { canEditGrant } from "../../utility/permissions";

interface GrantScheduleProps {
  grantProgram: GrantProgram;
  setGrantProgram: React.Dispatch<React.SetStateAction<GrantProgram>>;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  getGrantProgram: () => Promise<void>;
}

const scheduleFields: Array<{ key: keyof GrantProgram["schedule"]; label: string }> = [
  { key: "applicationStartDate", label: "Application Start Date" },
  { key: "applicationEndDate", label: "Application End Date" },
  { key: "decisionDate", label: "Decision Date" },
  { key: "fundDisbursementDate", label: "Fund Disbursement Date" },
];

const GrantSchedule: React.FC<GrantScheduleProps> = ({
  grantProgram,
  setGrantProgram,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { providerStaff } = useOutletContext<{ providerStaff?: ProviderStaff }>();
  const isEditable = canEditGrant(providerStaff, grantProgram);
  const isReadOnly = !isEditable;

  // Local DateValue map to pass directly to DatePicker and avoid conversions each renderxe
  const [localDateValues, setLocalDateValues] = useState<Record<string, DateValue>>(() => {
    const init: Record<string, DateValue> = {};
    scheduleFields.forEach(({ key }) => {
      init[key] = toDateValue(grantProgram?.schedule?.[key] ?? null);
    });
    return init;
  });

  // Reset localDateValues only when grantProgram.id changes (avoid updating each render)
  useEffect(() => {
    setLocalDateValues(() => {
      const init: Record<string, DateValue> = {};
      scheduleFields.forEach(({ key }) => {
        init[key] = toDateValue(grantProgram?.schedule?.[key] ?? null);
      });
      return init;
    });
  }, [grantProgram?.id]); // <-- important: depend on id only

  const fromDateValue = (val: DateValue): string | null => {
    if (!val || !val.year || !val.month || !val.day) return null;
    return `${val.year}-${val.month.padStart(2, "0")}-${val.day.padStart(2, "0")}`;
  };

  const handleDateChange = useCallback((field: keyof GrantProgram["schedule"], value: DateValue) => {
    if (isReadOnly) return;
    setLocalDateValues(prev => {
      // avoid creating a new object if value didn't change (prevent extra renders)
      const prevVal = prev[field];
      if (
        prevVal?.day === value?.day &&
        prevVal?.month === value?.month &&
        prevVal?.year === value?.year
      ) {
        return prev;
      }
      return { ...prev, [field]: value };
    });
  }, [isReadOnly]);

  // Helper to convert DateValue to JS Date
  const toJsDate = (val: DateValue): Date | null => {
    if (!val || !val.year || !val.month || !val.day) return null;
    return new Date(
      parseInt(val.year),
      parseInt(val.month) - 1,
      parseInt(val.day)
    );
  };

  // Validation function
  const validateScheduleDates = (): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appStart = toJsDate(localDateValues.applicationStartDate);
    const appEnd = toJsDate(localDateValues.applicationEndDate);
    const decision = toJsDate(localDateValues.decisionDate);
    const fundDisbursement = toJsDate(localDateValues.fundDisbursementDate);

    // All dates must be in the future
    for (const [label, date] of [
      ["Application Start Date", appStart],
      ["Application End Date", appEnd],
      ["Decision Date", decision],
      ["Fund Disbursement Date", fundDisbursement],
    ]) {
      if (!date) return `Please select ${label}.`;
      if (date <= today) return `${label} must be in the future.`;
    }

    // Order validation
    if (appEnd <= appStart) return "Application End Date must be after Application Start Date.";
    if (decision <= appEnd) return "Decision Date must be after Application End Date.";
    if (decision <= appStart) return "Decision Date must be after Application Start Date.";
    if (fundDisbursement <= decision) return "Fund Disbursement Date must be after Decision Date.";
    if (fundDisbursement <= appEnd) return "Fund Disbursement Date must be after Application End Date.";
    if (fundDisbursement <= appStart) return "Fund Disbursement Date must be after Application Start Date.";

    return null;
  };

  const handleSaveSchedule = useCallback(async () => {
    if (isReadOnly) return;
    const errorMsg = validateScheduleDates();
    setValidationError(errorMsg);
    if (errorMsg) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const payload: GrantProgram["schedule"] = {
        applicationStartDate: fromDateValue(localDateValues.applicationStartDate),
        applicationEndDate: fromDateValue(localDateValues.applicationEndDate),
        decisionDate: fromDateValue(localDateValues.decisionDate),
        fundDisbursementDate: fromDateValue(localDateValues.fundDisbursementDate),
      };
      const response = await updateGrantProgramSchedule(grantProgram.id, payload) as { data?: { schedule?: GrantProgram["schedule"] } };
      if (response && response.data && response.data.schedule) {
        setGrantProgram(prev => ({
          ...prev,
          schedule: response.data && response.data.schedule ? response.data.schedule : prev.schedule
        }));
      }
      setSubmitSuccess("Schedule saved.");
      navigate("../eligibility");
    } catch (err) {
      setSubmitError("Failed to save schedule.");
    } finally {
      setIsSubmitting(false);
    }
  }, [grantProgram.id, localDateValues, isReadOnly, navigate, setGrantProgram]);

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Set Grant Program Schedule"
        headline="Define the timeline for your grant program"
        provider={true}
      />
      {isReadOnly && (
        <div className="read-only-notice">
          <p>This grant program is currently in "{grantProgram.status}" status and cannot be modified.</p>
        </div>
      )}
      <div className={`form-group ${isReadOnly ? 'form-group--readonly' : ''}`}>
        {scheduleFields.map(({ key, label }) => (
          <DatePicker
            key={key}
            id={String(key)}
            name={String(key)}
            label={label}
            value={localDateValues[key]}
            onChange={(val) => handleDateChange(key, val)}
            disabled={isReadOnly}
          />
        ))}
      </div>
      <Button
        text={isSubmitting ? "Saving..." : "Save Schedule"}
        type="button"
        disabled={isSubmitting || isReadOnly}
        onClick={handleSaveSchedule}
      />
      {validationError && <div className="error-message">{validationError}</div>}
      {submitError && <div className="error-message">{submitError}</div>}
      {submitSuccess && <div className="success-message">{submitSuccess}</div>}
    </div>
  );
};

export default GrantSchedule;