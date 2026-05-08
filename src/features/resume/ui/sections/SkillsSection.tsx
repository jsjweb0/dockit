import type { Resume } from "../../model/resume.types";
import { useState } from "react";
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

type Props = { value: Resume; onChange: (next: Resume) => void };

function toList(v: string) {
    return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function toText(list: string[]) {
    return list.join(", ");
}

export function SkillsSection({ value, onChange }: Props) {
    const [primaryText, setPrimaryText] = useState(() => toText(value.skills.primary));
    const [toolsText, setToolsText] = useState(() => toText(value.skills.tools));

    const setPrimary = (text: string) => {
        setPrimaryText(text);
        onChange({ ...value, skills: { ...value.skills, primary: toList(text) } });
    };

    const setTools = (text: string) => {
        setToolsText(text);
        onChange({ ...value, skills: { ...value.skills, tools: toList(text) } });
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
                <Field>
                    <FieldLabel htmlFor="skills-primary" className="font-bold">핵심 스킬 (콤마로 구분)</FieldLabel>
                    <Input
                        id="skills-primary"
                        type="text"
                        value={primaryText}
                        onChange={(e) => setPrimary(e.target.value)}
                        placeholder="예: HTML, CSS, JavaScript, React, TypeScript"
                        autoComplete="off"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="skills-tools" className="font-bold">툴/협업 (콤마로 구분)</FieldLabel>
                    <Input
                        id="skills-tools"
                        type="text"
                        value={toolsText}
                        onChange={(e) => setTools(e.target.value)}
                        placeholder="예: Git, GitHub, Figma, Notion, Vercel"
                        autoComplete="off"
                    />
                </Field>
            </FieldGroup>
        </FieldSet>
    );
}
