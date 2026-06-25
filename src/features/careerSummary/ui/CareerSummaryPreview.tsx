import type { CareerSummary } from '../model/careerSummary.types';

type Props = { value: CareerSummary };

export function CareerSummaryPreview({ value }: Props) {
    return (
        <div className="coverLetterDocument">
            <div className="coverLetterDocument__header">
                <h2 className="coverLetterDocument__title mb-8 font-bold text-2xl tracking-widest">
                    {value.title || '경력기술서'}
                </h2>
            </div>

            <div className="coverLetterDocument__body">
                {value.techStack.trim() && (
                    <article className="coverLetterDocument__section border-t-2 border-t-black border-b border-b-muted">
                        <h3 className="flex justify-center items-center px-4 bg-muted text-center font-bold">
                            보유기술
                        </h3>
                        <div className="py-4 px-5 whitespace-pre-line break-keep">
                            {value.techStack}
                        </div>
                    </article>
                )}
                {value.experiences.map((section) => (
                    <article key={section.id} className="coverLetterDocument__section border-t-2 border-t-black border-b border-b-muted">
                        <div className="flex gap-2 px-8 py-3 border-b bg-muted text-xl font-bold">
                            <h3 className="">
                                {section.company || '회사명'}
                            </h3>
                            <p>
                                {[section.role, section.team].filter(Boolean).join(' / ') || '직무/소속'}
                            </p>
                            <p>{section.period}</p>
                        </div>
                        <div className="grid gap-3 py-4 px-8 break-keep">
                            <div>
                                <h4 className="text-xl font-semibold">
                                    {section.responsibilities}
                                </h4>
                            </div>
                            <div>
                                <h4 className="font-semibold">주요 성과</h4>
                                <div className="mt-2 grid gap-3">
                                    {section.achievements.map((achievement, index) => (
                                        <div key={`${section.id}-achievement-${index}`}>
                                            <p className="font-medium">
                                                {achievement.title || '성과 제목을 작성해 주세요.'}
                                            </p>
                                            <p className="mt-1 whitespace-pre-line">
                                                {achievement.description ||
                                                    '성과 설명을 작성해 주세요.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
