import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Resume } from '../model/resume.types';
import { BasicsSection } from './sections/BasicsSection';
import { EducationSection } from './sections/EducationSection';
import { CertificationSection } from './sections/CertificationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { LinkItemSection } from '@/features/resume/ui/sections/LinkItemSection';

type Props = {
  value: Resume;
  onChange: (next: Resume) => void;
  onSubmit: () => void;
};

export function ResumeForm({ value, onChange, onSubmit }: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="resumeEditorPane lg:px-10 lg:pt-8 lg:pb-15">
      <h2 className="mb-4 text-xl md:text-2xl font-semibold">문서작성</h2>

      <form id="resume-form" onSubmit={handleSubmit}>
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="flex h-auto w-full justify-start overflow-x-auto p-1 sm:grid sm:grid-cols-7">
            <TabsTrigger value="basics">기본</TabsTrigger>
            <TabsTrigger value="edu">학력</TabsTrigger>
            <TabsTrigger value="cer">자격증</TabsTrigger>
            <TabsTrigger value="exp">경력</TabsTrigger>
            <TabsTrigger value="proj">프로젝트</TabsTrigger>
            <TabsTrigger value="link">링크</TabsTrigger>
            <TabsTrigger value="skills">스킬</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-4">
            <BasicsSection value={value} onChange={onChange} />
          </TabsContent>

          <TabsContent value="edu" className="mt-4">
            <EducationSection value={value} onChange={onChange} />
          </TabsContent>

          <TabsContent value="cer" className="mt-4">
            <CertificationSection value={value} onChange={onChange} />
          </TabsContent>

          <TabsContent value="exp" className="mt-4">
            <ExperienceSection value={value} onChange={onChange} />
          </TabsContent>

          <TabsContent value="proj" className="mt-4">
            <ProjectsSection value={value} onChange={onChange} />
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <LinkItemSection value={value} onChange={onChange} />
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <SkillsSection value={value} onChange={onChange} />
          </TabsContent>
        </Tabs>
      </form>
    </section>
  );
}
