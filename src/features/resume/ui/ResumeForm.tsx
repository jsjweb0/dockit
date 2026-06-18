import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Resume } from '../model/resume.types';
import { useResumeEditor } from '../context/resumeEditor.context';
import type { ResumeValidationTab } from '../context/resumeEditor.context';
import { BasicsSection } from './sections/BasicsSection';
import { EducationSection } from './sections/EducationSection';
import { CertificationSection } from './sections/CertificationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { LinkItemSection } from '@/features/resume/ui/sections/LinkItemSection';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: Resume;
  onChange: (next: Resume) => void;
};

export function ResumeForm({ value, onChange }: Props) {
  const { validationErrorCounts, getFirstValidationErrorTarget, resetVersion } =
    useResumeEditor();
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { value: 'basics', label: '기본', count: validationErrorCounts.basics },
    { value: 'edu', label: '학력', count: validationErrorCounts.edu },
    { value: 'cer', label: '자격증', count: validationErrorCounts.cer },
    { value: 'exp', label: '경력', count: validationErrorCounts.exp },
    { value: 'proj', label: '프로젝트', count: validationErrorCounts.proj },
    { value: 'link', label: '링크', count: validationErrorCounts.link },
    { value: 'skills', label: '스킬', count: validationErrorCounts.skills },
  ] as const;

  const pendingFocusId = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocusId.current) return;
    const el = document.getElementById(pendingFocusId.current);
    if (el) {
      el.focus();
      pendingFocusId.current = null;
    }
  }, [activeTab]);

  const focusFirstError = (tab: ResumeValidationTab) => {
    const target = getFirstValidationErrorTarget(tab);

    if (!target) return;

    pendingFocusId.current = target.fieldId;

    if (target.tab === activeTab) {
      document.getElementById(target.fieldId)?.focus();
      pendingFocusId.current = null;
      return;
    }

    setActiveTab(target.tab);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex h-auto w-full justify-start overflow-x-auto p-1 sm:grid sm:grid-cols-7" aria-label="이력서 작성 항목">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="gap-0.5"
            onClick={() => focusFirstError(tab.value)}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <>
                <span
                  className="inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-semibold leading-4 text-white"
                  aria-hidden="true"
                >
                  {tab.count}
                </span>
                <span className="sr-only">오류 {tab.count}개</span>
              </>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="basics" className="mt-4">
        <BasicsSection value={value} onChange={onChange} />
      </TabsContent>

      <TabsContent value="edu" className="mt-4 min-h-0 min-w-0 w-full">
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
        <SkillsSection
          key={resetVersion}
          value={value}
          onChange={onChange}
        />
      </TabsContent>
    </Tabs>
  );
}
