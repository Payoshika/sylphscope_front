import React, { useState } from "react";
import Button from "../components/basicComponents/Button";
import FormInput from "../components/FormInput";
import Select from "../components/inputComponents/Select";
import Textarea from "../components/inputComponents/Textarea";
import TitleAndHeadLine from "../components/TitleAndHeadLine";
import { contactService } from "../services/ContactService";
import { useToast } from "../contexts/ToastContext";

// Contact DTO types based on backend structure
export type ContactCategory = 
  | "GENERAL"
  | "TECHNICAL" 
  | "BILLING"
  | "SCHOLARSHIP"
  | "PARTNERSHIP"
  | "FEEDBACK";

interface ContactFormData {
  category: string;
  title: string;
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState<ContactFormData>({
    category: "",
    title: "",
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactCategories = [
    { value: "GENERAL", label: "General Inquiry" },
    { value: "TECHNICAL", label: "Technical Support" },
    { value: "SCHOLARSHIP", label: "Scholarship Questions" },
    { value: "PARTNERSHIP", label: "Partnership Opportunities" },
    { value: "FEEDBACK", label: "Feedback & Suggestions" }
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert form data to ContactRequestDto format
      const contactRequestDto = {
        category: formData.category,
        title: formData.title,
        name: formData.name,
        email: formData.email,
        message: formData.message
      };

      // Call the backend API
      await contactService.submitContact(contactRequestDto);
      
      // Success - show success toast and reset form
      showSuccess(
        "Thank you for your message! We'll get back to you soon.",
        "Message Sent"
      );
      
      setFormData({
        category: "",
        title: "",
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showError(
        "Sorry, there was an error submitting your message. Please try again later.",
        "Submission Failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grant-create-content">
        <div className="content">
      <TitleAndHeadLine
        title="Contact Us"
        headline="Get in touch with our team. We're here to help with any questions or concerns."
        student={true}
      />
      <div className="w-full px-8 pb-8">
        <div className="rounded-lg shadow-md border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contact Category */}
            <Select
              id="category"
              name="category"
              label="Contact Category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              options={contactCategories}
              placeholder="Select a category"
              required
            />

            {/* Contact Title */}
            <div>
              <FormInput
                id="title"
                name="title"
                type="text"
                label="Subject *"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Brief description of your inquiry"
              />
            </div>

            {/* Name */}
            <div>
              <FormInput
                id="name"
                name="name"
                type="text"
                label="Full Name *"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address *"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Message Content */}
            <Textarea
              id="message"
              name="message"
              label="Message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Please provide details about your inquiry..."
              rows={6}
              required
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                text={isSubmitting ? "Sending..." : "Send Message"}
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                fullWidth={true}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;