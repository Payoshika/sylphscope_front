export type InputType =
  | "TEXT"
  | "TEXTAREA"
  | "NUMBER"
  | "DATE"
  | "MULTISELECT"
  | "RADIO"
  | "FILE_UPLOAD";

  export type DataType =
  | "STRING"
  | "INTEGER"
  | "LONG"
  | "DOUBLE"
  | "BOOLEAN"
  | "DATE"
  | "DATETIME"
  | "ARRAY"
  | "OBJECT";

export type ComparisonOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "in_list"
  | "not_in_list"
  | "exists"
  | "not_exists"
  | "contains"
  | "not_contains";

export type EligibilityCriteriaType = "SINGLE" | "QUESTION_GROUP";

export type LogicalOperator = "AND" | "OR" | "NOT";

export interface ConditionGroup {
  // Define as needed; if not specified, use a generic structure:
  conditions: QuestionCondition[];
  // Optionally, add more fields if your backend has them
}

export interface CombinationLogic {
  logicalOperator: LogicalOperator;
  conditionGroups: ConditionGroup[];
}

export interface QuestionCondition {
  questionId: string;
  description?: string;
  comparisonOperator: ComparisonOperator;
  values: any[]; // Use a stricter type if you know the possible value types
  valueDataType: DataType;
}

// Define Question type according to your backend structure
export interface Question {
  id?: string;
  name: string;
  inputType: InputType;
  questionDataType: DataType;
  questionText: string;
  description?: string;
  optionSetId?: string;
  isRequired?: boolean;
  requiresConditionalUpload?: boolean;
  conditionalUploadLabel?: string;
  createdAt?: string; 
}

export interface Option {
  id?: string;
  label: string;
  value: any; 
}

export interface QuestionEligibilityInfoDto {
  question: Question;
  options: Option[];
  operators: ComparisonOperator[];
}

export interface QuestionGroupEligibilityInfoDto {
  id: string;
  name: string;
  description: string;
  questions: QuestionEligibilityInfoDto[];
}

export interface EligibilityCriteriaDTO {
  id: string;
  grantProgramId: string;
  name: string;
  description: string;
  required: boolean;
  criteriaType: EligibilityCriteriaType;

  // For simple criteria
  questionId?: string;
  simpleCondition?: QuestionCondition;

  // For complex criteria
  questionGroupId?: string;
  combinationLogic?: CombinationLogic;
  questionConditions?: QuestionCondition[];
}

export interface QuestionConditionPair {
  question: QuestionEligibilityInfoDto;
  condition: QuestionCondition;
}

export interface EligibilityGroupFormState {
  groupId: string;
  groupName: string;
  groupDescription: string;
  questionConditions: QuestionConditionPair[];
  isPending?: boolean;
}

