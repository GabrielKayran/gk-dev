export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  techs: string[];
  current: boolean;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Project {
  number: string;
  title: string;
  description: string;
  tags: string[];
  githubUrls: { label: string; url: string }[];
  demoUrl: string;
  available: boolean;
}

export interface ContactLink {
  label: string;
  url: string;
  icon: string;
}
