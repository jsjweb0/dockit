import { ResumeForm } from "@/features/resume/ui/ResumeForm";
import { ResumePreview } from "@/features/resume/ui/ResumePreview";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {useResumeEditor} from "@/features/resume/context/resumeEditor.context.tsx";
import { Info } from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

export function ResumeBuilderPage() {
    const { resume, setResume } = useResumeEditor();

    return (
        <div className="grid gap-6 md:grid-cols-[1fr_1.25fr]">
            <ResumeForm value={resume} onChange={setResume} />

            <div className="rounded-2xl p-8 bg-[#f7f8fa]">
                    <div className="flex items-center gap-1.5 border-b border-gray-200 pb-4 mb-6">
                    <h2 className="text-2xl font-semibold">미리보기</h2>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="fill-black stroke-white" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>입력하면 자동 반영됩니다.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Card className="sticky md:top-6 md:self-start border-0">
                    <CardContent>
                        <ResumePreview value={resume} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
