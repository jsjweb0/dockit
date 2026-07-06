import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResumePreview } from './ResumePreview';
import { defaultResume } from '../model/resume.defaults';

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
});
