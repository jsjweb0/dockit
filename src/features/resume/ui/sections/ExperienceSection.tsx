import type {Experience, Resume} from "../../model/resume.types";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

export function ExperienceSection({ value, onChange }: Props) {
    const list = value.experience;

    const update = (id: string, patch: Partial<Experience>) => {
        onChange({
            ...value,
            experience: list.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        });
    };

    const add = () => {
        onChange({
            ...value,
            experience: [
                ...list,
                {
                    id: uid(),
                    company: "",
                    role: "",
                    start: "",
                    isCurrent: false,
                    end: "",
                    description: "",
                },
            ],
        });
    };

    const remove = (id: string) => {
        onChange({ ...value, experience: list.filter((x) => x.id !== id) });
    };

    return (
         <FieldSet>
            <FieldLegend>경력정보</FieldLegend>
            <div className="flex items-center justify-between gap-3">
                <FieldDescription>
                    아르바이트, 인턴, 실무 경험은 맡은 일과 결과가 보이게 작성해 주세요.
                </FieldDescription>
                <Button type="button" variant="outline" onClick={add} aria-label="경력 추가">
                    + 경력 추가
                </Button>
            </div>
            <FieldSeparator />

            {list.map((e, idx) => (
                <FieldGroup key={e.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="font-medium">경력 {idx + 1}</div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(e.id)}
                            disabled={list.length <= 1}
                        >
                            삭제
                        </Button>
                    </div>
                    <div className="grid gap-3 grid-cols-[auto_80px]">
                        <Field>
                            <FieldLabel htmlFor={`company-${e.id}`} className="text-sm text-muted-foreground">회사명</FieldLabel>
                            <Input
                                id={`company-${e.id}`}
                                type="text"
                                value={e.company}
                                onChange={(ev) => update(e.id, { company: ev.target.value })}
                                placeholder="예: 닷킷 스튜디오"
                                autoComplete="organization"
                                required
                            />
                        </Field>
                        <Field orientation="horizontal" className="mt-8">
                            <Checkbox 
                                id={`isCurrent-${e.id}`}
                                checked={e.isCurrent}
                                onCheckedChange={(checked) => {
                                    const isCurrent = checked === true;
                                    update(e.id, { isCurrent, end: isCurrent ? "" : e.end });
                                }}
                                className="peer"
                            />
                            <FieldLabel htmlFor={`isCurrent-${e.id}`} className="text-sm text-muted-foreground peer-data-[state=checked]:text-black">
                                재직 중
                            </FieldLabel>
                        </Field>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel htmlFor={`start-${e.id}`} className="text-sm text-muted-foreground">시작</FieldLabel>
                                <Input
                                    id={`start-${e.id}`}
                                    type="month"
                                    value={e.start}
                                    onChange={(ev) => update(e.id, { start: ev.target.value })}
                                    autoComplete="off"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`end-${e.id}`} className="text-sm text-muted-foreground">종료</FieldLabel>
                                <Input
                                    id={`end-${e.id}`}
                                    type="month"
                                    value={e.end ?? ""}
                                    onChange={(ev) => update(e.id, { end: ev.target.value })}
                                    disabled={e.isCurrent}
                                    autoComplete="off"
                                    required={!e.isCurrent}
                                />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor={`role-${e.id}`} className="text-sm text-muted-foreground">직무/직책</FieldLabel>
                            <Input
                                id={`role-${e.id}`}
                                type="text"
                                value={e.role}
                                onChange={(ev) => update(e.id, { role: ev.target.value })}
                                placeholder="예: 웹 퍼블리셔 인턴"
                                autoComplete="organization-title"
                                required
                            />
                        </Field>
                    </div>

                    <div className="mt-3">
                        <Field>
                            <FieldLabel htmlFor={`description-${e.id}`} className="text-sm text-muted-foreground">업무/성과(줄바꿈 가능)</FieldLabel>
                            <Textarea
                                id={`description-${e.id}`}
                                value={e.description}
                                onChange={(ev) => update(e.id, { description: ev.target.value })}
                                rows={5}
                                placeholder={"예)\n- 이벤트 페이지 HTML/CSS 마크업 및 반응형 레이아웃 구현\n- 반복되는 카드 UI를 React 컴포넌트로 분리해 유지보수성 개선\n- Lighthouse 접근성 경고를 확인하고 label/alt 누락 항목 수정"}
                                autoComplete="off"
                            />
                        </Field>
                    </div>
                </FieldGroup>
            ))}
        </FieldSet>
    );
}
