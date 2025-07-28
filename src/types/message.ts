export interface MessageContent {
  id: string;
  messageId: string;
  senderName: string;
  receiverName: string;
  text: string;
  createdAt: string; // ISO string for LocalDateTime
  updatedAt: string; // ISO string for LocalDateTime
}

export interface Message {
  id: string;
  studentId: string;
  studentName: string;
  providerId: string;
  providerName: string;
  providerStaffId: string;
  providerStaffName: string;
  grantProgramId: string;
  grantProgramTitle: string;
  messages: MessageContent[];
  createdAt: string; // ISO string for LocalDateTime
  updatedAt: string; // ISO string for LocalDateTime
}
