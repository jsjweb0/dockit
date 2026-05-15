import { ResumeForm } from '@/features/resume/ui/ResumeForm';
import { ResumePreview } from '@/features/resume/ui/ResumePreview';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { useResumeEditor } from '@/features/resume/context/resumeEditor.context.tsx';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ResumeBuilderPage() {
  const { resume, setResume, previewRef } = useResumeEditor();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <ResumeForm value={resume} onChange={setResume} />

      <section
        className={cn(
          'rounded-xl bg-[#f7f8fa] p-4 md:p-8',
          'max-lg:hidden max-lg:fixed max-lg:inset-0 max-lg:z-50 max-lg:overflow-y-auto',
        )}
        aria-labelledby="resume-preview-title"
      >
        <div className="mb-4 flex items-center gap-1.5 border-b border-gray-200 pb-4 md:mb-6">
          <h2 id="resume-preview-title" className="text-2xl font-semibold">
            미리보기
          </h2>
          <Tooltip>
            <TooltipTrigger aria-label="미리보기 안내">
              <Info className="fill-black stroke-white" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>입력하면 자동 반영됩니다.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Card className="py-0 border-0">
          <CardContent className="overflow-x-auto p-6">
            <ResumePreview ref={previewRef} value={resume} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
