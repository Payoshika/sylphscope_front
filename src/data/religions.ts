export interface ReligionType {
  value: string;
  label: string;
  category: 'major' | 'eastern' | 'indigenous' | 'other' | 'non-religious';
}

export const religions: ReligionType[] = [
  { value: "", label: "Select Religion", category: 'other' },
  
  // Major World Religions
  { value: "christianity", label: "Christianity", category: 'major' },
  { value: "islam", label: "Islam", category: 'major' },
  { value: "judaism", label: "Judaism", category: 'major' },
  { value: "hinduism", label: "Hinduism", category: 'major' },
  { value: "buddhism", label: "Buddhism", category: 'major' },
  { value: "sikhism", label: "Sikhism", category: 'major' },
  
  // Eastern & Traditional
  { value: "jainism", label: "Jainism", category: 'eastern' },
  { value: "taoism", label: "Taoism", category: 'eastern' },
  { value: "confucianism", label: "Confucianism", category: 'eastern' },
  { value: "shintoism", label: "Shintoism", category: 'eastern' },
  { value: "zoroastrianism", label: "Zoroastrianism", category: 'eastern' },
  { value: "bahai", label: "Bahá'í Faith", category: 'eastern' },
  
  // Indigenous & Traditional
  { value: "african-traditional", label: "African Traditional Religions", category: 'indigenous' },
  { value: "native-american", label: "Native American Religions", category: 'indigenous' },
  { value: "australian-aboriginal", label: "Australian Aboriginal Religions", category: 'indigenous' },
  { value: "indigenous-other", label: "Other Indigenous Religions", category: 'indigenous' },
  
  // Other Religious Movements
  { value: "church-of-jesus-christ-lds", label: "The Church of Jesus Christ of Latter-day Saints", category: 'other' },
  { value: "jehovahs-witnesses", label: "Jehovah's Witnesses", category: 'other' },
  { value: "seventh-day-adventist", label: "Seventh-day Adventist", category: 'other' },
  { value: "unitarian-universalism", label: "Unitarian Universalism", category: 'other' },
  { value: "rastafarianism", label: "Rastafarianism", category: 'other' },
  { value: "wicca", label: "Wicca", category: 'other' },
  { value: "neo-paganism", label: "Neo-Paganism", category: 'other' },
  { value: "new-age", label: "New Age Spirituality", category: 'other' },
  { value: "spiritual-not-religious", label: "Spiritual but Not Religious", category: 'other' },
  { value: "other", label: "Other", category: 'other' },
  
  // Non-Religious
  { value: "atheism", label: "Atheism", category: 'non-religious' },
  { value: "agnosticism", label: "Agnosticism", category: 'non-religious' },
  { value: "secular-humanism", label: "Secular Humanism", category: 'non-religious' },
  { value: "no-religion", label: "No Religion", category: 'non-religious' },
  { value: "prefer-not-to-say", label: "Prefer Not to Say", category: 'non-religious' },
];

export const religionCategories = {
  major: "Major World Religions",
  eastern: "Eastern & Traditional",
  indigenous: "Indigenous & Cultural",
  other: "Other Religious Movements",
  'non-religious': "Non-Religious"
};

export const getReligionsByCategory = (category: ReligionType['category']): ReligionType[] => {
  return religions.filter(religion => religion.category === category && religion.value !== "");
};

export const getReligionByValue = (value: string): ReligionType | undefined => {
  return religions.find(religion => religion.value === value);
};

export const getReligionLabel = (value: string): string => {
  const religion = getReligionByValue(value);
  return religion ? religion.label : "";
};

export const searchReligions = (query: string): ReligionType[] => {
  if (!query.trim()) return religions;
  
  const searchTerm = query.toLowerCase().trim();
  return religions.filter(religion =>
    religion.label.toLowerCase().includes(searchTerm) ||
    religion.value.toLowerCase().includes(searchTerm)
  );
};