import { Dot as IconDot } from 'lucide-react';
import type { CareerSummary } from '../model/careerSummary.types';
import { Fragment } from 'react/jsx-runtime';
import { Badge } from '@/components/ui/badge';

type Props = { value: CareerSummary };

export function CareerSummaryPreview({ value }: Props) {
    return (
        <div className="careerSummaryDocument">
            <div className="careerSummaryDocument__header">
                <h2 className="careerSummaryDocument__title mb-8 font-bold text-2xl tracking-widest text-center">
                    {value.title || '경력 기술서'}
                </h2>
            </div>

            <div className="careerSummaryDocument__body border-t-2 border-t-black">
                {value.experiences.map((section) => (
                    <article key={section.id} className="grid grid-cols-[170px_auto] gap-10 py-5 border-b">
                        <div className="flex flex-col items-end gap-2 text-[18px]">
                            <div className="flex gap-1">
                                <p className="">{section.startDate}</p>
                                <span>~</span>
                                <p>
                                    {section.isCurrent ? '재직 중' : section.endDate}
                                </p>
                            </div>
                            <div className="flex gap-1.5">
                                <Badge variant="outline" className="bg-sky-50 text-sky-700">3년 1개월</Badge>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className="flex gap-4 items-baseline text-xl font-semibold">
                                    <h3 className="">
                                        {section.company || '회사명'}
                                    </h3>
                                    <div className="inline-block w-px h-4 bg-muted-foreground/40"></div>
                                    <p className="flex gap-2 items-center">
                                        <span>{section.team}</span>  <span>{section.role}</span>
                                    </p>
                                </div>
                                <h4 className="mt-2 text-[18px] text-muted-foreground">
                                    {section.responsibilities}
                                </h4>
                            </div>
                            <div className="grid break-keep mt-3 leading-relaxed">
                                {section.achievements.map((achievement, index) => (
                                    <Fragment key={`${section.id}-achievement-${index}`}>
                                        <p className="flex">
                                            <IconDot className="-mt-1" /> {achievement.title || '주요성과 1'}
                                        </p>
                                        {achievement.description && (
                                            <div className="mb-4 pl-6 whitespace-pre-line font-light">
                                                {achievement.description}
                                            </div>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}

                {value.techStack.trim() && (
                    <article className="">
                        <h3 className="flex items-center px-4 font-bold">
                            보유기술
                        </h3>
                        <div className="py-4 px-5 whitespace-pre-line break-keep">
                            {value.techStack}
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
}
