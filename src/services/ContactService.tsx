import { apiClient } from "../utility/ApiClient";

export interface ContactRequestDto {
  category: string;
  title: string;
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  submitContact: async (contactRequestDto: ContactRequestDto): Promise<void> => {
    try {
      const response = await apiClient.post("/api/contact", contactRequestDto);
      console.log("Contact form submitted successfully:", response.data);
      if (!response.success) {
        throw new Error(response.message || "Failed to submit contact form");
      }
      
      // No return needed for void Promise
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  }
};
