import { Dot as IconDot } from 'lucide-react';
import type { CareerSummary } from '../model/careerSummary.types';
import { Fragment } from 'react/jsx-runtime';
import { Badge } from '@/components/ui/badge';

type Props = { value: CareerSummary };

function getCareerDuration(startDate: string, endDate?: string) {
    if (!startDate || !endDate) return "";

    const [startYear, startMonth] = startDate.split("-").map(Number);
    const [endYear, endMonth] = endDate.split("-").map(Number);

    const totalMonths =
        (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    if (totalMonths <= 0) return "";

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years > 0 && months > 0) return `${years}년 ${months}개월`;
    if (years > 0) return `${years}년`;
    return `${months}개월`;
}

function getCurrentYearMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
}

export function CareerSummaryPreview({ value }: Props) {
    return (
        <div className="careerSummaryDocument">
            <div className="careerSummaryDocument__header">
                <h2 className="careerSummaryDocument__title mb-8 font-bold text-2xl tracking-widest text-center">
                    {value.title || '경력 기술서'}
                </h2>
            </div>
            <p className="mb-2 text-base font-medium">총 경력 8년 2개월</p>
            <div className="careerSummaryDocument__body border-t-2 border-t-black">
                {value.experiences.map((section) => {
                    const durationEndDate = section.isCurrent ? getCurrentYearMonth() : section.endDate;
                    const duration = getCareerDuration(section.startDate, durationEndDate);
                    const visibleTechStack = section.techStack.filter((tech) => tech.trim())

                    return (
                        <article key={section.id} className="grid grid-cols-[170px_auto] gap-6 py-5 border-b border-b-black break-inside-avoid">
                            <div className="flex flex-col items-end gap-2 text-base">
                                <div className="flex gap-1">
                                    <p className="">{section.startDate}</p>
                                    <span>~</span>
                                    <p>
                                        {section.isCurrent ? '재직 중' : section.endDate}
                                    </p>
                                </div>
                                {duration && (
                                    <div className="flex gap-1.5">
                                        <Badge variant="outline" className="bg-sky-50 text-sky-700">
                                            {duration}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="pl-1.5">
                                    <div className="flex gap-4 items-center text-base font-semibold">
                                        <h3 className="">
                                            {section.company || '회사명'}
                                        </h3>
                                        <div className="inline-block w-px h-3 bg-muted-foreground/30"></div>
                                        <p className="flex gap-2 items-center">
                                            <span>{section.team}</span>  <span>{section.role}</span>
                                        </p>
                                    </div>
                                    <h4 className="mt-1.5 text-base text-muted-foreground">
                                        {section.responsibilities}
                                    </h4>
                                </div>
                                <div className="grid break-keep mt-4 leading-relaxed">
                                    {section.achievements.map((achievement, index) => (
                                        <Fragment key={`${section.id}-achievement-${index}`}>
                                            <p className="flex">
                                                <IconDot className="-mt-0.5 size-6" /> {achievement.title || '주요성과 1'}
                                            </p>
                                            {achievement.description && (
                                                <div className="mb-4 pl-6 whitespace-pre-line font-light">
                                                    {achievement.description}
                                                </div>
                                            )}
                                        </Fragment>
                                    ))}
                                </div>

                                {visibleTechStack.length > 0 && (
                                    <div>
                                        <p className="flex">
                                            <IconDot className="-mt-0.5 size-6" /> Skill Keywords
                                        </p>
                                        <ul className="flex flex-wrap gap-1.5 ml-5 mt-0.5">
                                            {visibleTechStack.map((tech) => (
                                                <li key={tech}>
                                                    <Badge variant="secondary" className="gap-1 pr-1">
                                                        {tech}
                                                    </Badge>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
