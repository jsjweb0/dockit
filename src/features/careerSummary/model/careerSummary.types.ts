export type Achievement = {
  title: string;
  description: string; // 성과 설명
};

export type CareerExperience = {
  id: string;
  company: string;
  team: string;
  role: string;
  period: string;
  responsibilities: string; // 주요 업무
  achievements: Achievement[]; // 주요 성과
};

export type CareerSummary = {
  meta: { version: 1 };
  title: string; // 예: 프론트엔드 개발자 경력기술서
  experiences: CareerExperience[];
  techStack: string; // 보유기술
};
