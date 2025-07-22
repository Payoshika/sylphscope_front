import React, { useState, useEffect } from "react";
import type { GrantProgram } from "../../types/grantProgram";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import DatePicker from "../../components/inputComponents/datePickers/DatePicker";
import type { DateValue } from "../../components/inputComponents/datePickers/types";
import { updateGrantProgramSchedule } from "../../services/GrantProgramService";
import { toDateValue } from "../../components/inputComponents/datePickers/utils";

interface GrantScheduleProps {
  grantProgram: GrantProgram;
  setGrantProgram: React.Dispatch<React.SetStateAction<GrantProgram>>;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  getGrantProgram: () => Promise<void>;
}

const GrantSchedule: React.FC<GrantScheduleProps> = ({
  grantProgram,
  setGrantProgram,
  onUpdateGrant,
  getGrantProgram,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

useEffect(() => {
const fetchAndUpdate = async () => {
    await getGrantProgram();
};
fetchAndUpdate();
}, []);

// Helper to convert DateValue to string (YYYY-MM-DD)
const fromDateValue = (val: DateValue): string | null => {
  if (!val.year || !val.month || !val.day) return null;
  return `${val.year}-${val.month.padStart(2, "0")}-${val.day.padStart(2, "0")}`;
};

const updateScheduleFromBackend = (schedule: any) => ({
  applicationStartDate: toDateValue(schedule.applicationStartDate),
  applicationEndDate: toDateValue(schedule.applicationEndDate),
  decisionDate: toDateValue(schedule.decisionDate),
  fundDisbursementDate: toDateValue(schedule.fundDisbursementDate),
});


  const handleDateChange = (field: keyof GrantProgram["schedule"], value: string | null) => {
    setGrantProgram(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value,
      },
    }));
  };

const handleSaveSchedule = async () => {
  setIsSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(null);
  try {
    console.log("saving the date", grantProgram.schedule);
    const response = await updateGrantProgramSchedule(grantProgram.id, grantProgram.schedule);
    console.log("response", response);
    if (
      response &&
      typeof response.data === "object" &&
      response.data !== null &&
      "schedule" in response.data
    ) {
      const data = response.data as { schedule: GrantProgram["schedule"] };
      setGrantProgram(prev => ({
        ...prev,
        schedule: {
          applicationStartDate: data.schedule.applicationStartDate,
          applicationEndDate: data.schedule.applicationEndDate,
          decisionDate: data.schedule.decisionDate,
          fundDisbursementDate: data.schedule.fundDisbursementDate,
        }
      }));
    }
    setSubmitSuccess("Schedule saved.");
  } catch (err) {
    setSubmitError("Failed to save schedule.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Set Grant Program Schedule"
        headline="Define the timeline for your grant program"
        provider={true}
      />
      <div className="form-group">
        <DatePicker
          id="applicationStartDate"
          name="applicationStartDate"
          label="Application Start Date"
          value={toDateValue(grantProgram.schedule.applicationStartDate)}
          onChange={val => handleDateChange("applicationStartDate", val)}
        />
        <DatePicker
          id="applicationEndDate"
          name="applicationEndDate"
          label="Application End Date"
            value={toDateValue(grantProgram.schedule.applicationEndDate)}
          onChange={val => handleDateChange("applicationEndDate", val)}
        />
        <DatePicker
          id="decisionDate"
          name="decisionDate"
          label="Decision Date"
          value={toDateValue(grantProgram.schedule.decisionDate)}
          onChange={val => handleDateChange("decisionDate", val)}
        />
        <DatePicker
          id="fundDisbursementDate"
          name="fundDisbursementDate"
          label="Fund Disbursement Date"
          value={toDateValue(grantProgram.schedule.fundDisbursementDate)}
          onChange={val => handleDateChange("fundDisbursementDate", val)}
        />
      </div>
      <Button
        text={isSubmitting ? "Saving..." : "Save Schedule"}
        type="button"
        disabled={isSubmitting}
        onClick={handleSaveSchedule}
      />
      {submitError && <div className="error-message">{submitError}</div>}
      {submitSuccess && <div className="success-message">{submitSuccess}</div>}
    </div>
  );
};
export default GrantSchedule;