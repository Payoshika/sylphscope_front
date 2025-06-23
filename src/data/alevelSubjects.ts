export interface ALevelSubject {
  value: string;
  label: string;
  category: 'sciences' | 'mathematics' | 'humanities' | 'languages' | 'arts' | 'social-sciences' | 'business' | 'practical';
}

export const alevelSubjects: ALevelSubject[] = [
  { value: "", label: "Select A-Level Subject", category: 'sciences' },
  
  // Sciences
  { value: "biology", label: "Biology", category: 'sciences' },
  { value: "chemistry", label: "Chemistry", category: 'sciences' },
  { value: "physics", label: "Physics", category: 'sciences' },
  { value: "computer-science", label: "Computer Science", category: 'sciences' },
  { value: "environmental-science", label: "Environmental Science", category: 'sciences' },
  { value: "geology", label: "Geology", category: 'sciences' },
  
  // Mathematics
  { value: "mathematics", label: "Mathematics", category: 'mathematics' },
  { value: "further-mathematics", label: "Further Mathematics", category: 'mathematics' },
  { value: "statistics", label: "Statistics", category: 'mathematics' },
  
  // Humanities
  { value: "history", label: "History", category: 'humanities' },
  { value: "geography", label: "Geography", category: 'humanities' },
  { value: "english-language", label: "English Language", category: 'humanities' },
  { value: "english-literature", label: "English Literature", category: 'humanities' },
  { value: "philosophy", label: "Philosophy", category: 'humanities' },
  { value: "religious-studies", label: "Religious Studies", category: 'humanities' },
  { value: "classical-civilisation", label: "Classical Civilisation", category: 'humanities' },
  { value: "archaeology", label: "Archaeology", category: 'humanities' },
  
  // Languages
  { value: "french", label: "French", category: 'languages' },
  { value: "german", label: "German", category: 'languages' },
  { value: "spanish", label: "Spanish", category: 'languages' },
  { value: "italian", label: "Italian", category: 'languages' },
  { value: "mandarin", label: "Mandarin Chinese", category: 'languages' },
  { value: "arabic", label: "Arabic", category: 'languages' },
  { value: "latin", label: "Latin", category: 'languages' },
  { value: "greek", label: "Ancient Greek", category: 'languages' },
  { value: "russian", label: "Russian", category: 'languages' },
  { value: "japanese", label: "Japanese", category: 'languages' },
  { value: "portuguese", label: "Portuguese", category: 'languages' },
  
  // Social Sciences
  { value: "psychology", label: "Psychology", category: 'social-sciences' },
  { value: "sociology", label: "Sociology", category: 'social-sciences' },
  { value: "politics", label: "Politics", category: 'social-sciences' },
  { value: "law", label: "Law", category: 'social-sciences' },
  { value: "anthropology", label: "Anthropology", category: 'social-sciences' },
  { value: "criminology", label: "Criminology", category: 'social-sciences' },
  
  // Arts
  { value: "art-design", label: "Art & Design", category: 'arts' },
  { value: "music", label: "Music", category: 'arts' },
  { value: "drama-theatre", label: "Drama & Theatre Studies", category: 'arts' },
  { value: "dance", label: "Dance", category: 'arts' },
  { value: "media-studies", label: "Media Studies", category: 'arts' },
  { value: "photography", label: "Photography", category: 'arts' },
  { value: "textiles", label: "Textiles", category: 'arts' },
  { value: "film-studies", label: "Film Studies", category: 'arts' },
  { value: "music-technology", label: "Music Technology", category: 'arts' },
  
  // Business & Economics
  { value: "business-studies", label: "Business Studies", category: 'business' },
  { value: "economics", label: "Economics", category: 'business' },
  { value: "accounting", label: "Accounting", category: 'business' },
  
  // Practical/Applied
  { value: "design-technology", label: "Design & Technology", category: 'practical' },
  { value: "physical-education", label: "Physical Education", category: 'practical' },
  { value: "health-social-care", label: "Health & Social Care", category: 'practical' },
  { value: "travel-tourism", label: "Travel & Tourism", category: 'practical' },
  { value: "engineering", label: "Engineering", category: 'practical' },
];

export const getALevelSubjectsByCategory = (category: ALevelSubject['category']): ALevelSubject[] => {
  return alevelSubjects.filter(subject => subject.category === category);
};

export const getALevelSubjectByValue = (value: string): ALevelSubject | undefined => {
  return alevelSubjects.find(subject => subject.value === value);
};

export const getALevelSubjectLabel = (value: string): string => {
  const subject = getALevelSubjectByValue(value);
  return subject ? subject.label : "";
};