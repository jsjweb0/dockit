import { forwardRef } from 'react';
import type { CoverLetter } from '../model/coverLetter.types';

type Props = { value: CoverLetter };

export const CoverLetterPreview = forwardRef<HTMLElement, Props>(
  ({ value }, ref) => {
    return (
      <section ref={ref} className="coverLetterDocument" aria-hidden="true">
        <div className="coverLetterDocument__header">
          <h2 className="coverLetterDocument__title">
            <span>자</span>
            <span>기</span>
            <span>소</span>
            <span>개</span>
            <span>서</span>
          </h2>
          {value.title && <p>{value.title}</p>}
        </div>

        <div className="coverLetterDocument__body">
          {value.sections.map((section) => (
            <article key={section.id} className="coverLetterDocument__section">
              <h3>{section.title}</h3>
              <p>{section.content || section.prompt}</p>
            </article>
          ))}
        </div>
      </section>
    );
  },
);
