export type ApplicationType = 'new' | 'experienced' | '';

export const APPLICATION_TYPE_LABELS: Record<
  Exclude<ApplicationType, ''>,
  string
> = {
  new: '신입',
  experienced: '경력',
};

export function formatApplicationType(type: ApplicationType): string {
  if (type === 'new') return APPLICATION_TYPE_LABELS.new;
  if (type === 'experienced') return APPLICATION_TYPE_LABELS.experienced;
  return '신입 / 경력';
}

export type ResumeBasics = {
  applicationType: ApplicationType;
  name: string;
  nameEn: string;
  birth?: string; // YYYY-MM-DD (옵션)
  phone: string;
  email: string;
  address: string;
  title: string; // 예: "프론트엔드 개발자", 지원부문
  summary: string; // 한줄/짧은 요약
  submittedAt: string;
};

export type Education = {
  id: string;
  period: string;
  institution: string; // 학교명
  major: string; // 전공
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string; // YYYY-MM
  isCurrent: boolean;
  end?: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  period: string; // YYYY.MM~YYYY.MM 등 자유
  stack: string;
  description: string;
  link?: string;
};

export type LinkItem = {
  id: string;
  label: string;
  url: string;
};

export type Certification = {
  id: string;
  acquiredAt: string; // YYYY-MM-DD
  name: string; // 자격증명
  issuer: string; // 발행처
};

export type Skills = {
  primary: string[]; // 핵심 스킬
  tools: string[]; // 툴/협업
};

export type Resume = {
  meta: { version: 1 };
  basics: ResumeBasics;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  links: LinkItem[];
  skills: Skills;
  certifications: Certification[];
};
