import type { Resume } from "../../model/resume.types";
import {
    FieldDescription,
    FieldGroup,
    FieldLegend,
    FieldSeparator,
    FieldSet
} from "@/components/ui/field";
import { SkillTagEditor } from "@/features/shared/ui/SkillTagEditor";

type Props = { value: Resume; onChange: (next: Resume) => void };
type SkillGroup = "primary" | "tools";

export function SkillsSection({ value, onChange }: Props) {
    const updateSkills = (group: SkillGroup, nextSkills: string[]) => {
        onChange({
            ...value,
            skills: {
                ...value.skills,
                [group]: nextSkills,
            },
        });
    };

    return (
        <FieldSet>
            <FieldLegend>스킬입력</FieldLegend>
            <div className="flex items-center justify-between gap-3">
                <FieldDescription>
                    채용 공고에서 자주 보는 기술을 앞쪽에 두면 문서 스캔이 쉬워집니다.
                </FieldDescription>
            </div>
            <FieldSeparator />
            <FieldGroup>
                <SkillTagEditor
                    key={`primary-${value.skills.primary.join("|")}`}
                    inputId="skills-primary"
                    label="핵심 스킬"
                    listLabel="등록된 핵심 스킬"
                    placeholder="예: React"
                    skills={value.skills.primary}
                    onChange={(nextSkills) => updateSkills("primary", nextSkills)}
                />
                <SkillTagEditor
                    key={`tools-${value.skills.tools.join("|")}`}
                    inputId="skills-tools"
                    label="툴/협업"
                    listLabel="등록된 툴/협업 스킬"
                    placeholder="예: Git"
                    skills={value.skills.tools}
                    onChange={(nextSkills) => updateSkills("tools", nextSkills)}
                />
            </FieldGroup>
        </FieldSet>
    );
}
