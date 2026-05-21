import type {Resume, LinkItem} from "../../model/resume.types";
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
import { Plus } from "lucide-react";

type Props = { value: Resume; onChange: (next: Resume) => void };

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

export function LinkItemSection({ value, onChange }: Props) {
    const list = value.links;

    const update = (id: string, patch: Partial<LinkItem>) => {
        onChange({
            ...value,
            links: list.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        });
    };

    const add = () => {
        onChange({
            ...value,
            links: [
                ...list,
                { id: uid(), label: "", url: "" },
            ],
        });
    };

    const remove = (id: string) => {
        onChange({ ...value, links: list.filter((x) => x.id !== id) });
    };

    return (
        <FieldSet>
            <FieldLegend>링크정보</FieldLegend>
            <div className="flex items-center justify-between gap-3">
                <FieldDescription>
                    GitHub, 배포 주소, 포트폴리오처럼 채용자가 바로 확인할 링크를 넣어 주세요.
                </FieldDescription>
                <Button type="button" variant="outline" className="gap-1" onClick={add}>
                    <Plus aria-hidden="true" /> 링크 추가
                </Button>
            </div>
            <FieldSeparator />

            {list.map((l, idx) => (
                <FieldGroup key={l.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="font-medium">링크 {idx + 1}</div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(l.id)}
                            disabled={list.length <= 1}
                        >
                            삭제
                        </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor={`label-${l.id}`} className="text-sm text-muted-foreground">링크 이름</FieldLabel>
                            <Input
                                id={`label-${l.id}`}
                                type="text"
                                value={l.label}
                                onChange={(ev) => update(l.id, { label: ev.target.value })}
                                placeholder="예: GitHub"
                                autoComplete="off"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor={`url-${l.id}`} className="text-sm text-muted-foreground">URL</FieldLabel>
                            <Input
                                id={`url-${l.id}`}
                                type="url"
                                value={l.url}
                                onChange={(ev) => update(l.id, { url: ev.target.value })}
                                placeholder="예: https://github.com/username"
                                inputMode="url"
                                autoComplete="url"
                                required
                            />
                        </Field>
                    </div>
                </FieldGroup>
            ))}
        </FieldSet>
    );
}

