export type CoverLetterSection = {
  id: string;
  title: string;
  prompt: string;
  content: string;
};

export type CoverLetter = {
  meta: { version: 1 };
  title: string; // 사용자가 입력: "삼성전자 자기소개서"
  sections: CoverLetterSection[];
};
