export interface Provider {
  id: string;
  organisationName: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  organisationDescription: string;
  logoUrl: string;
  createdAt: string;
  invitationCode?: string;
}