import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldError,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CoverLetter } from '../model/coverLetter.types';
import { cn } from '@/lib/utils';
import { Fragment } from 'react/jsx-runtime';
import type { CoverLetterFieldErrors } from '../model/coverLetter.validation';

type Props = {
  value: CoverLetter;
  onChange: (next: CoverLetter) => void;
  errors?: CoverLetterFieldErrors;
  onSectionBlur?: (sectionId: string) => void;
  onSectionChange?: (sectionId: string, next: CoverLetter) => void;
};

export function CoverLetterForm({
  value,
  onChange,
  errors,
  onSectionBlur,
  onSectionChange,
}: Props) {
  const updateSectionContent = (sectionId: string, content: string) => {
    const nextValue = {
      ...value,
      sections: value.sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section,
      ),
    };

    onChange(nextValue);
    onSectionChange?.(sectionId, nextValue);
  };

  const sectionLimit = 700;

  return (
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

        {value.sections.map((section) => {
          const textareaId = `cover-letter-section-${section.id}`;
          const errorMessage = errors?.sections[section.id];

          return (
            <Fragment key={section.id}>
              <Field data-invalid={!!errorMessage}>
                <FieldLabel htmlFor={textareaId} className="font-bold">
                  {section.title}
                </FieldLabel>
                <div className="relative">
                  <Textarea
                    id={textareaId}
                    value={section.content}
                    onChange={(event) =>
                      updateSectionContent(section.id, event.target.value)
                    }
                    onBlur={() => onSectionBlur?.(section.id)}
                    maxLength={sectionLimit}
                    aria-describedby={`${section.id}-prompt ${section.id}-count ${errorMessage ? `${section.id}-error` : ''
                      }`}
                    aria-invalid={!!errorMessage}
                    placeholder={section.prompt}
                    className="resize-none h-52 pb-6"
                    autoComplete="off"
                  />
                  <p
                    id={`${section.id}-count`}
                    className="mt-1 mr-1 text-right text-sm tracking-tight text-gray-500"
                  >
                    <span className={cn(section.content.length >= 600 && 'font-bold')}>
                      {section.content.length}
                    </span>{' '}
                    / {sectionLimit}
                  </p>
                  <p id={`${section.id}-prompt`} className="sr-only">
                    {section.prompt}
                  </p>
                  {errorMessage && (
                    <FieldError id={`${section.id}-error`}>
                      {errorMessage}
                    </FieldError>
                  )}
                </div>

              </Field>
              <FieldSeparator />
            </Fragment>
          )
        })
        }
      </FieldGroup>
    </FieldSet>
  );
}
