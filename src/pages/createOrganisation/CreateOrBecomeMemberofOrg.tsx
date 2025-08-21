import React, { useState } from "react";
import Button from "../../components/basicComponents/Button";
import TextInput from "../../components/inputComponents/TextInput";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import { createEmptyProvider, addStaffMember } from "../../services/ProviderService";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const CreateOrBecomeMemberofOrg: React.FC = () => {
  const { user } = useAuth();
  const [invitationCode, setInvitationCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleCreateOrganisation = async () => {
    if (!user?.id) {
      setMessage("User not available. Please sign in.");
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      const created = await createEmptyProvider(user.id);
      setMessage(`Organisation created (id: ${created.id ?? "unknown"})`);
      // navigate using full-page load so the browser refreshes and lands on organisation page
      window.location.assign("/organisation");
    } catch (err) {
      console.error("createEmptyProvider failed", err);
      setMessage("Failed to create organisation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBecomeMember = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!invitationCode.trim()) {
      setMessage("Please enter an invitation code.");
      return;
    }
    if (!user?.id) {
      setMessage("User not available. Please sign in.");
      return;
    }
    const code = invitationCode.trim().slice(0, 20);
    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await addStaffMember(user.id, code);
      setMessage(`Joined organisation (providerId: ${res.providerId})`);
      showSuccess("Joined organisation successfully", "Success");
      window.location.assign("/organisation");
    } catch (err) {
      console.error("addStaffMember failed", err);
      setMessage("Failed to join organisation. Please check the code and try again.");
      showError("Failed to join organisation", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Join or Create an Organisation"
        headline="Create a new organisation or join one using an invitation code"
        provider={true}
      />

      <div className="create-or-join-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card__body">
            <h3>Create Organisation</h3>
            <p>Start a new organisation. You will be able to set name, description and staff later.</p>
            <div style={{ marginTop: 16 }}>
              <Button text={isSubmitting ? "Creating..." : "Create Organisation"} onClick={handleCreateOrganisation} disabled={isSubmitting} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card__body">
            <h3>Become a Member</h3>
            <p>Enter the invitation code provided by your organisation to join as a member.</p>
            <form className="form-group" onSubmit={handleBecomeMember} style={{ marginTop: 12 }}>
              <TextInput
                id="invitation-code"
                name="invitationCode"
                label="Invitation Code"
                placeholder="Enter invitation code"
                value={invitationCode}
                onChange={(e) => setInvitationCode((e.target.value || "").slice(0, 20))}
              />
              <div style={{ marginTop: 12 }}>
                <Button text={isSubmitting ? "Joining..." : "Join Organisation"} type="submit" onClick={handleBecomeMember} disabled={isSubmitting} />
              </div>
            </form>
          </div>
        </div>
      </div>

      {message && (
        <div className="info-message" style={{ marginTop: 20 }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateOrBecomeMemberofOrg;
// ...existing code...