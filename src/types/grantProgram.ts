export enum GrantStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    IN_REVIEW = "IN_REVIEW",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED"
}

export interface Schedule {
  applicationStartDate: string;
  applicationEndDate: string;  
  decisionDate: string; 
  fundDisbursementDate: string; 
}

export interface GrantProgram {
  id: string;
  title: string;
  description: string;
  providerId: string;
  status: GrantStatus;
  schedule: Schedule;
  questionIds: string[];
  questionGroupsIds: string[];
}