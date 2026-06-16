import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CoverLetter } from '../model/coverLetter.types';

type Props = {
  value: CoverLetter;
  onChange: (next: CoverLetter) => void;
};

export function CoverLetterForm({ value, onChange }: Props) {
  const updateSectionContent = (sectionId: string, content: string) => {
    onChange({
      ...value,
      sections: value.sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    });
  };

  return (
    <section className="resumeEditorPane lg:px-10 lg:pt-9 lg:pb-15">
      <div className="mb-4">
        <h2 className="text-xl font-semibold md:text-2xl">문서작성</h2>
      </div>
      <FieldSet>
        <FieldLegend>{value.title || '자기소개서'}</FieldLegend>
        <FieldDescription>
          제출처에 맞는 제목을 입력하고, 문항별 내용을 작성해 주세요.
        </FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="cover-letter-title" className="font-bold">
              자기소개서 제목
            </FieldLabel>
            <Input
              id="cover-letter-title"
              value={value.title}
              onChange={(event) =>
                onChange({ ...value, title: event.target.value })
              }
              placeholder="예: 삼성전자 자기소개서"
            />
          </Field>

          {value.sections.map((section) => (
            <Field key={section.id}>
              <FieldLabel htmlFor={section.id} className="font-bold">
                {section.title}
              </FieldLabel>
              <Textarea
                id={section.id}
                value={section.content}
                onChange={(event) =>
                  updateSectionContent(section.id, event.target.value)
                }
                placeholder={section.prompt}
                rows={8}
              />
              <FieldDescription>{section.prompt}</FieldDescription>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </section>
  );
}
