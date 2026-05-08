import type { Resume, Education } from "../../model/resume.types";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet
} from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X as CloseIcon } from "lucide-react";

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

export function EducationSection({ value, onChange }: Props) {
    const list = value.education;

    const update = (id: string, patch: Partial<Education>) => {
        onChange({
            ...value,
            education: list.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        });
    };

    const add = () => {
        onChange({
            ...value,
            education: [
                ...list,
                { id: uid(), period: "", institution: "", major: "" },
            ],
        });
    };

    const remove = (id: string) => {
        onChange({ ...value, education: list.filter((x) => x.id !== id) });
    };

    return (
        <FieldSet>
            <FieldLegend>학력정보</FieldLegend>
            <div className="flex items-center justify-between gap-3">
                <FieldDescription>
                    최신 학력부터 입력하면 미리보기에서 읽기 좋게 정리됩니다.
                </FieldDescription>
                <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={add} aria-label="학력 추가">
                    <Plus />
                </Button>
            </div>
            <FieldSeparator />
            
            {list.map((e, idx) => (
                <FieldGroup key={e.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="font-bold">학력 {idx + 1}</div>
                        {list.length > 1 &&
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => remove(e.id)}
                            >
                                <CloseIcon />
                                삭제
                            </Button>
                        }
                    </div>
                    <Field>
                        <FieldLabel htmlFor={`institution-${e.id}`} className="text-sm text-muted-foreground">학교</FieldLabel>
                        <Input
                            id={`institution-${e.id}`}
                            type="text"
                            value={e.institution}
                            onChange={(ev) => update(e.id, { institution: ev.target.value })}
                            placeholder="예: 한국대학교"
                            autoComplete="organization"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={`period-${e.id}`} className="text-sm text-muted-foreground">기간</FieldLabel>
                        <Input
                            id={`period-${e.id}`}
                            type="text"
                            value={e.period}
                            onChange={(ev) => update(e.id, { period: ev.target.value })}
                            placeholder="예: 2021.03 - 2025.02"
                            autoComplete="off"
                            inputMode="numeric"
                            required
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={`major-${e.id}`} className="text-sm text-muted-foreground">전공</FieldLabel>
                        <Input
                            id={`major-${e.id}`}
                            type="text"
                            value={e.major}
                            onChange={(ev) => update(e.id, { major: ev.target.value })}
                            placeholder="예: 컴퓨터공학과"
                            autoComplete="off"
                            required
                        />
                    </Field>
                </FieldGroup>
            ))}
        </FieldSet>
    );
}
