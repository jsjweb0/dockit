import type { ApplicationType, Resume } from '../../model/resume.types';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.tsx';
import { useResumeEditor } from '../../context/resumeEditor.context';
import type { BasicsValidatedField } from '../../model/resume.basics.validation';
import { cn } from '@/lib/utils';

type Props = { value: Resume; onChange: (next: Resume) => void };

export function BasicsSection({ value, onChange }: Props) {
  const { basicsErrors, touchBasicsField, revalidateBasicsField } =
    useResumeEditor();
  const b = value.basics;

  const set = (key: keyof Resume['basics'], v: string) => {
    onChange({ ...value, basics: { ...b, [key]: v } });
  };

  const bindValidatedField = (field: BasicsValidatedField) => ({
    onBlur: (basics: Resume['basics']) => touchBasicsField(field, basics),
    onChangeAfter: (basics: Resume['basics']) =>
      revalidateBasicsField(field, basics),
    error: basicsErrors[field],
    errorId: `${field}-error`,
  });

  const nameField = bindValidatedField('name');
  const phoneField = bindValidatedField('phone');
  const emailField = bindValidatedField('email');
  const workerTitleField = bindValidatedField('workerTitle');

  const summaryLength = b.summary.length;
  const summaryLimit = 100;

  return (
    <FieldSet>
      <FieldLegend>기본정보</FieldLegend>
      <FieldDescription>
        이력서 상단에 바로 노출되는 정보입니다. 실제 지원 문서처럼 정확하게
        입력해 주세요.
      </FieldDescription>
      <FieldSeparator />
      <FieldGroup>
        <Field>
          <FieldLabel id="applicationType-label" className="font-bold">
            지원구분
          </FieldLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            spacing={0}
            value={b.applicationType || undefined}
            onValueChange={(next) => {
              const nextType = (next ?? '') as ApplicationType;
              onChange({
                ...value,
                basics: { ...b, applicationType: nextType },
              });
            }}
            aria-labelledby="applicationType-label"
            className="w-full"
          >
            <ToggleGroupItem value="new" className="flex-1">
              신입
            </ToggleGroupItem>
            <ToggleGroupItem value="experienced" className="flex-1">
              경력
            </ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field data-invalid={!!workerTitleField.error}>
          <FieldLabel htmlFor="workerTitle" className="font-bold">
            지원부문
          </FieldLabel>
          <Input
            id="workerTitle"
            type="text"
            value={b.title}
            onChange={(e) => {
              const nextBasics = { ...b, title: e.target.value };
              onChange({ ...value, basics: nextBasics });
              workerTitleField.onChangeAfter(nextBasics);
            }}
            onBlur={() => workerTitleField.onBlur(b)}
            placeholder="예: 프론트엔드 개발자, 웹 퍼블리셔"
            autoComplete="organization-title"
            required
            aria-invalid={!!workerTitleField.error}
            aria-describedby={
              workerTitleField.error ? workerTitleField.errorId : undefined
            }
          />
          {workerTitleField.error && (
            <FieldError id={workerTitleField.errorId}>
              {workerTitleField.error}
            </FieldError>
          )}
        </Field>
        <Field data-invalid={!!nameField.error}>
          <FieldLabel htmlFor="userName" className="font-bold">
            이름(한글)
          </FieldLabel>
          <Input
            id="userName"
            type="text"
            value={b.name}
            onChange={(e) => {
              const nextBasics = { ...b, name: e.target.value };
              onChange({ ...value, basics: nextBasics });
              nameField.onChangeAfter(nextBasics);
            }}
            onBlur={() => nameField.onBlur(b)}
            placeholder="예: 정수진"
            autoComplete="name"
            required
            aria-invalid={!!nameField.error}
            aria-describedby={nameField.error ? nameField.errorId : undefined}
          />
          {nameField.error && (
            <FieldError id={nameField.errorId}>{nameField.error}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="userNameEn" className="font-bold">
            이름(영문)
          </FieldLabel>
          <Input
            id="userNameEn"
            type="text"
            value={b.nameEn}
            onChange={(e) => set('nameEn', e.target.value)}
            placeholder="예: Sujin Jeong"
            autoComplete="name"
            autoCapitalize="words"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="birth" className="font-bold">
            생년월일
          </FieldLabel>
          <Input
            id="birth"
            type="date"
            value={b.birth}
            onChange={(e) => set('birth', e.target.value)}
            autoComplete="bday"
          />
        </Field>
        <Field data-invalid={!!phoneField.error}>
          <FieldLabel htmlFor="phone" className="font-bold">
            연락처
          </FieldLabel>
          <Input
            id="phone"
            type="tel"
            value={b.phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
              const formatted = digits
                .replace(/^(02)(\d{0,4})(\d{0,4})$/, (_, area, mid, last) =>
                  [area, mid, last].filter(Boolean).join('-'),
                )
                .replace(/^(01\d)(\d{0,4})(\d{0,4})$/, (_, area, mid, last) =>
                  [area, mid, last].filter(Boolean).join('-'),
                );
              const nextPhone = formatted || digits;
              const nextBasics = { ...b, phone: nextPhone };
              onChange({ ...value, basics: nextBasics });
              phoneField.onChangeAfter(nextBasics);
            }}
            onBlur={() => phoneField.onBlur(b)}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="숫자만 입력해 주세요."
            required
            aria-invalid={!!phoneField.error}
            aria-describedby={phoneField.error ? phoneField.errorId : undefined}
          />
          {phoneField.error && (
            <FieldError id={phoneField.errorId}>{phoneField.error}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="address" className="font-bold">
            주소
          </FieldLabel>
          <Input
            id="address"
            type="text"
            value={b.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="예: 서울특별시 종로구"
            autoComplete="street-address"
          />
        </Field>
        <Field data-invalid={!!emailField.error}>
          <FieldLabel htmlFor="email" className="font-bold">
            이메일
          </FieldLabel>
          <Input
            id="email"
            type="email"
            value={b.email}
            onChange={(e) => {
              const nextBasics = { ...b, email: e.target.value };
              onChange({ ...value, basics: nextBasics });
              emailField.onChangeAfter(nextBasics);
            }}
            onBlur={() => emailField.onBlur(b)}
            placeholder="예: user@example.com"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={!!emailField.error}
            aria-describedby={emailField.error ? emailField.errorId : undefined}
          />
          {emailField.error && (
            <FieldError id={emailField.errorId}>{emailField.error}</FieldError>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="summary" className="font-bold">
            간단 소개
            <span id="summary-help" className="sr-only">100자 이내로 작성해 주세요.</span>
          </FieldLabel>
          <div className="relative">
            <Textarea
              id="summary"
              value={b.summary}
              onChange={(e) => set('summary', e.target.value)}
              maxLength={summaryLimit}
              aria-describedby="summary-help summary-count"
              placeholder="예: 웹 표준과 반응형 UI를 고려해 사용하기 쉬운 화면을 구현합니다."
              className="resize-none h-31 sm:h-24 pb-6"
              autoComplete="off"
            />
            <p id="summary-count" className="absolute right-2 bottom-2 text-sm tracking-tight text-gray-500">
              <span className={cn(summaryLength >= 80 && 'font-bold')}>
                {summaryLength}
              </span>{' '}
              / {summaryLimit}
            </p>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="submittedAt" className="font-bold">
            작성일
          </FieldLabel>
          <Input
            id="submittedAt"
            type="date"
            value={b.submittedAt}
            onChange={(e) => set('submittedAt', e.target.value)}
            placeholder="YYYY-MM-DD"
            autoComplete="off"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
