import type { CoverLetter } from '../model/coverLetter.types';

type Props = { value: CoverLetter };

export function CoverLetterPreview({ value }: Props) {
  return (
    <div className="coverLetterDocument">
      <div className="coverLetterDocument__header">
        <h2 className="coverLetterDocument__title mb-8 font-bold text-2xl tracking-widest">
          자기소개서
        </h2>
      </div>

      <div className="coverLetterDocument__body grid gap-5">
        {value.sections.map((section) => (
          <article key={section.id} className="coverLetterDocument__section grid grid-cols-[76px_auto] min-h-50 border-t-2 border-t-black border-b border-b-muted">
            <h3 className="flex justify-center items-center px-4 bg-muted text-center font-bold writing-vertical tracking-widest">{section.title}</h3>
            <div className="py-4 px-5 whitespace-pre-line break-keep">{section.content || section.prompt}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
