export interface GCSESubject {
  value: string;
  label: string;
  category: 'core' | 'humanities' | 'sciences' | 'languages' | 'arts' | 'practical' | 'business';
}

export const gcseSubjects: GCSESubject[] = [
  { value: "", label: "Select GCSE Subject", category: 'core' },
  
  // Core Subjects
  { value: "english-language", label: "English Language", category: 'core' },
  { value: "english-literature", label: "English Literature", category: 'core' },
  { value: "mathematics", label: "Mathematics", category: 'core' },
  { value: "combined-science", label: "Combined Science", category: 'core' },
  
  // Sciences
  { value: "biology", label: "Biology", category: 'sciences' },
  { value: "chemistry", label: "Chemistry", category: 'sciences' },
  { value: "physics", label: "Physics", category: 'sciences' },
  { value: "computer-science", label: "Computer Science", category: 'sciences' },
  { value: "statistics", label: "Statistics", category: 'sciences' },
  
  // Humanities
  { value: "history", label: "History", category: 'humanities' },
  { value: "geography", label: "Geography", category: 'humanities' },
  { value: "religious-studies", label: "Religious Studies", category: 'humanities' },
  { value: "philosophy", label: "Philosophy", category: 'humanities' },
  { value: "citizenship", label: "Citizenship", category: 'humanities' },
  { value: "classical-civilisation", label: "Classical Civilisation", category: 'humanities' },
  
  // Languages
  { value: "french", label: "French", category: 'languages' },
  { value: "german", label: "German", category: 'languages' },
  { value: "spanish", label: "Spanish", category: 'languages' },
  { value: "italian", label: "Italian", category: 'languages' },
  { value: "mandarin", label: "Mandarin Chinese", category: 'languages' },
  { value: "arabic", label: "Arabic", category: 'languages' },
  { value: "latin", label: "Latin", category: 'languages' },
  { value: "greek", label: "Ancient Greek", category: 'languages' },
  { value: "urdu", label: "Urdu", category: 'languages' },
  { value: "polish", label: "Polish", category: 'languages' },
  { value: "portuguese", label: "Portuguese", category: 'languages' },
  { value: "russian", label: "Russian", category: 'languages' },
  
  // Arts
  { value: "art-design", label: "Art & Design", category: 'arts' },
  { value: "music", label: "Music", category: 'arts' },
  { value: "drama", label: "Drama", category: 'arts' },
  { value: "dance", label: "Dance", category: 'arts' },
  { value: "media-studies", label: "Media Studies", category: 'arts' },
  { value: "photography", label: "Photography", category: 'arts' },
  { value: "textiles", label: "Textiles", category: 'arts' },
  { value: "film-studies", label: "Film Studies", category: 'arts' },
  
  // Practical/Technical
  { value: "design-technology", label: "Design & Technology", category: 'practical' },
  { value: "food-nutrition", label: "Food Preparation & Nutrition", category: 'practical' },
  { value: "physical-education", label: "Physical Education", category: 'practical' },
  { value: "engineering", label: "Engineering", category: 'practical' },
  { value: "construction", label: "Construction", category: 'practical' },
  { value: "electronics", label: "Electronics", category: 'practical' },
  
  // Business & Economics
  { value: "business-studies", label: "Business Studies", category: 'business' },
  { value: "economics", label: "Economics", category: 'business' },
  { value: "accounting", label: "Accounting", category: 'business' },
];

export const getGCSESubjectsByCategory = (category: GCSESubject['category']): GCSESubject[] => {
  return gcseSubjects.filter(subject => subject.category === category);
};

export const getGCSESubjectByValue = (value: string): GCSESubject | undefined => {
  return gcseSubjects.find(subject => subject.value === value);
};

export const getGCSESubjectLabel = (value: string): string => {
  const subject = getGCSESubjectByValue(value);
  return subject ? subject.label : "";
};