import type { Resume } from '../../model/resume.types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.tsx';

type Props = { value: Resume; onChange: (next: Resume) => void };

export function BasicsSection({ value, onChange }: Props) {
  const b = value.basics;

  const set = (key: keyof Resume['basics'], v: string) => {
    onChange({ ...value, basics: { ...b, [key]: v } });
  };

  const setPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    const formatted = digits
      .replace(/^(02)(\d{0,4})(\d{0,4})$/, (_, area, mid, last) =>
        [area, mid, last].filter(Boolean).join('-'),
      )
      .replace(/^(01\d)(\d{0,4})(\d{0,4})$/, (_, area, mid, last) =>
        [area, mid, last].filter(Boolean).join('-'),
      );

    set('phone', formatted || digits);
  };

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
          <FieldLabel htmlFor="workerTitle" className="font-bold">
            직무 타이틀
          </FieldLabel>
          <Input
            id="workerTitle"
            type="text"
            value={b.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="예: 프론트엔드 개발자, 웹 퍼블리셔"
            autoComplete="organization-title"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="userName" className="font-bold">
            이름(한글)
          </FieldLabel>
          <Input
            id="userName"
            type="text"
            value={b.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="예: 정수진"
            autoComplete="name"
            required
          />
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
        <Field>
          <FieldLabel htmlFor="phone" className="font-bold">
            연락처
          </FieldLabel>
          <Input
            id="phone"
            type="tel"
            value={b.phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            autoComplete="tel"
            placeholder="숫자만 입력해 주세요."
            required
          />
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
        <Field>
          <FieldLabel htmlFor="email" className="font-bold">
            이메일
          </FieldLabel>
          <Input
            id="email"
            type="email"
            value={b.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="예: user@example.com"
            autoComplete="email"
            inputMode="email"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="summary" className="font-bold">
            간단 소개
          </FieldLabel>
          <Textarea
            id="summary"
            value={b.summary}
            onChange={(e) => set('summary', e.target.value)}
            rows={4}
            placeholder="예) 퍼블리싱 기반의 접근성/성능을 고려한 React UI를 만들고, 제품 관점으로 개선합니다."
            className="resize-none"
            autoComplete="off"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
