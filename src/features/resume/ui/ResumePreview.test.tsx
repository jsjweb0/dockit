import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ResumePreview } from './ResumePreview';
import { defaultResume } from '../model/resume.defaults';

import longResume from '@/test/fixtures/resume-long.json';
import emptyOptionalResume from '@/test/fixtures/resume-empty-optional.json';
import type { Resume } from '../model/resume.types';

afterEach(cleanup);

describe('ResumePreview', () => {
  it('입력한 필수값 내용이 preview에 표시된다', () => {
    const resume = {
      ...defaultResume(),
      basics: {
        ...defaultResume().basics,
        applicationType: 'new' as const,
        title: '프론트엔드 개발자',
        name: '정수진',
        phone: '010-1234-5678',
        email: 'sujin@example.com',
        birth: '2000-01-01',
      },
    };

    render(<ResumePreview value={resume} />);

    expect(screen.getByText('신입')).toBeInTheDocument();
    expect(screen.getByText('프론트엔드 개발자')).toBeInTheDocument();
    expect(screen.getAllByText('정수진')).toHaveLength(2);
    expect(screen.getByText('010-1234-5678')).toBeInTheDocument();
    expect(screen.getByText('sujin@example.com')).toBeInTheDocument();
    expect(screen.getByText('2000-01-01')).toBeInTheDocument();
  });
  it('프로젝트와 개인 링크의 URL 및 의미 있는 텍스트를 출력한다', () => {
    render(<ResumePreview value={longResume as Resume} />);
    for (const project of longResume.projects) {
      expect(screen.getByRole('link', { name: `${project.name} 링크: ${project.link}` }))
        .toHaveAttribute('href', project.link);
    }
    expect(screen.getByRole('link', { name: 'GitHub: https://github.com/example' }))
      .toHaveAttribute('href', 'https://github.com/example');
  });

  it('링크 없는 프로젝트와 빈 선택 정보에 가짜 데이터를 출력하지 않는다', () => {
    const value = {
      ...emptyOptionalResume,
      projects: [{ ...longResume.projects[0], link: '' }],
    } as Resume;
    const { container } = render(<ResumePreview value={value} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    for (const text of ['영문 이름', 'YYYY.MM.DD', 'GitHub / Portfolio', '이력서 사진', '신입 / 경력']) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
    expect(container.querySelector('.docTable__photo')).toBeEmptyDOMElement();
    expect([...container.querySelectorAll('td')].some((cell) => cell.textContent === '주소')).toBe(false);
  });

  it('선택 정보와 긴 본문의 마지막 내용까지 DOM에 보존한다', () => {
    const { container } = render(<ResumePreview value={{
      ...longResume as Resume,
      basics: { ...longResume.basics, applicationType: 'experienced', nameEn: 'Output Test', birth: '2000-01-01', address: '서울특별시 검증 주소' },
    }} />);
    expect(screen.getByText('Output Test')).toBeInTheDocument();
    expect(screen.getByText('서울특별시 검증 주소')).toBeInTheDocument();
    for (const entry of [...longResume.experience, ...longResume.projects]) {
      expect(container.textContent).toContain(entry.description);
    }
    expect(screen.getByText('React, TypeScript, Git')).toBeInTheDocument();
  });

  it('실행 가능한 URL 스킴은 링크로 만들지 않고 원문을 보존한다', () => {
    const value = { ...emptyOptionalResume, projects: [{ ...longResume.projects[0], link: 'javascript:alert(1)' }] } as Resume;
    render(<ResumePreview value={value} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('검증 프로젝트 1 링크: javascript:alert(1)')).toBeInTheDocument();
  });

  it('비어 있는 기본 정보에 예시 이름·연락처·직무를 채워 넣지 않는다', () => {
    const value = defaultResume();
    value.basics.title = '';
    value.basics.submittedAt = '';
    render(<ResumePreview value={value} />);
    for (const text of ['이름', '프론트엔드 개발자', '010-0000-0000', 'email@example.com', '년', '월', '일']) {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    }
  });

});
