import type { Resume } from "../../model/resume.types";
import { useState, type FormEvent } from "react";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

type Props = { value: Resume; onChange: (next: Resume) => void };
type SkillGroup = "primary" | "tools";
type SkillGroupEditorProps = {
    inputId: string;
    label: string;
    listLabel: string;
    placeholder: string;
    skills: string[];
    onAdd: (skill: string) => boolean;
    onRemove: (skill: string) => void;
};

function SkillGroupEditor({
    inputId,
    label,
    listLabel,
    placeholder,
    skills,
    onAdd,
    onRemove,
}: SkillGroupEditorProps) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const didAdd = onAdd(inputValue);
        if (didAdd) setInputValue("");
    };

    return (
        <Field>
            <FieldLabel htmlFor={inputId} className="font-bold">{label}</FieldLabel>
            <form className="flex gap-2" onSubmit={handleSubmit}>
                <Input
                    id={inputId}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                />
                <Button
                    type="submit"
                    variant="outline"
                    className="gap-1"
                    disabled={!inputValue.trim()}
                >
                    <Plus aria-hidden="true" /> 추가
                </Button>
            </form>
            <ul className="flex flex-wrap gap-2" aria-label={listLabel}>
                {skills.map((skill) => (
                    <li key={skill}>
                        <Badge variant="secondary" className="gap-1 pr-1">
                            {skill}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="size-5 rounded-full"
                                onClick={() => onRemove(skill)}
                                aria-label={`${skill} 삭제`}
                            >
                                <X aria-hidden="true" />
                            </Button>
                        </Badge>
                    </li>
                ))}
            </ul>
        </Field>
    );
}

export function SkillsSection({ value, onChange }: Props) {
    const addSkill = (group: SkillGroup, text: string) => {
        const nextSkill = text.trim();
        if (!nextSkill) return false;

        const currentSkills = value.skills[group];
        if (currentSkills.includes(nextSkill)) return false;

        onChange({
            ...value,
            skills: {
                ...value.skills,
                [group]: [...currentSkills, nextSkill],
            },
        });

        return true;
    };

    const removeSkill = (group: SkillGroup, skill: string) => {
        onChange({
            ...value,
            skills: {
                ...value.skills,
                [group]: value.skills[group].filter((item) => item !== skill),
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
                <SkillGroupEditor
                    key={`primary-${value.skills.primary.join("|")}`}
                    inputId="skills-primary"
                    label="핵심 스킬"
                    listLabel="등록된 핵심 스킬"
                    placeholder="예: React"
                    skills={value.skills.primary}
                    onAdd={(skill) => addSkill("primary", skill)}
                    onRemove={(skill) => removeSkill("primary", skill)}
                />
                <SkillGroupEditor
                    key={`tools-${value.skills.tools.join("|")}`}
                    inputId="skills-tools"
                    label="툴/협업"
                    listLabel="등록된 툴/협업 스킬"
                    placeholder="예: Git"
                    skills={value.skills.tools}
                    onAdd={(skill) => addSkill("tools", skill)}
                    onRemove={(skill) => removeSkill("tools", skill)}
                />
            </FieldGroup>
        </FieldSet>
    );
}
