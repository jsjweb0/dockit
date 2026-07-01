import { useState, type FormEvent } from "react";
import {
    Field,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X as IconX } from "lucide-react";

type SkillTagEditorProps = {
    inputId: string;
    label: string;
    listLabel: string;
    placeholder: string;
    skills: string[];
    onChange: (nextSkills: string[]) => void;
};

export function SkillTagEditor({
    inputId,
    label,
    listLabel,
    placeholder,
    skills,
    onChange,
}: SkillTagEditorProps) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextSkill = inputValue.trim();
        if (!nextSkill || skills.includes(nextSkill)) return;

        onChange([...skills, nextSkill]);
        setInputValue("");
    };

    const handleRemove = (skill: string) => {
        onChange(skills.filter((item) => item !== skill));
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
            <ul className="flex flex-wrap gap-1" aria-label={listLabel}>
                {skills.map((skill) => (
                    <li key={skill}>
                        <Badge variant="secondary" className="gap-1 pr-1">
                            {skill}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="size-5 rounded-full"
                                onClick={() => handleRemove(skill)}
                                aria-label={`${skill} 삭제`}
                            >
                                <IconX aria-hidden="true" />
                            </Button>
                        </Badge>
                    </li>
                ))}
            </ul>
        </Field>
    );
}
