import { Dot as IconDot } from 'lucide-react';
import type { CareerSummary, CareerExperience } from '../model/careerSummary.types';
import { Badge } from '@/components/ui/badge';
import { parseYearMonthToIndex } from '@/utils/date';

type Props = { value: CareerSummary };

function getCareerDuration(startDate: string, endDate?: string) {
    if (!startDate || !endDate) return "";

    const startIndex = parseYearMonthToIndex(startDate);
    const endIndex = parseYearMonthToIndex(endDate);

    if (startIndex === null || endIndex === null) return "";

    const totalMonths = endIndex - startIndex + 1;

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

function getTotalCareerDuration(experiences: CareerExperience[]) {
    const ranges = experiences
        .map((experience) => {
            if (!experience.startDate) return null;

            const endDate = experience.isCurrent
                ? getCurrentYearMonth()
                : experience.endDate;

            if (!endDate) return null;

            const [startYear, startMonth] = experience.startDate.split("-").map(Number);
            const [endYear, endMonth] = endDate.split("-").map(Number);

            const startIndex = startYear * 12 + startMonth;
            const endIndex = endYear * 12 + endMonth;

            if (startIndex > endIndex) return null;

            return { startIndex, endIndex };
        })
        .filter((range): range is { startIndex: number; endIndex: number } => Boolean(range))
        .sort((a, b) => a.startIndex - b.startIndex);

    if (ranges.length === 0) return "";

    const mergedRanges = ranges.reduce<{ startIndex: number; endIndex: number }[]>(
        (acc, range) => {
            const last = acc[acc.length - 1];

            if (!last || range.startIndex > last.endIndex + 1) {
                acc.push(range);
                return acc;
            }

            last.endIndex = Math.max(last.endIndex, range.endIndex);
            return acc;
        },
        [],
    );

    const totalMonths = mergedRanges.reduce(
        (sum, range) => sum + (range.endIndex - range.startIndex + 1),
        0,
    );

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years > 0 && months > 0) return `${years}년 ${months}개월`;
    if (years > 0) return `${years}년`;
    return `${months}개월`;
}

export function CareerSummaryPreview({ value }: Props) {
    const totalCareerDuration = getTotalCareerDuration(value.experiences);

    return (
        <div className="careerSummaryDocument">
            <div className="careerSummaryDocument__header text-center mb-6">
                <h2 className="careerSummaryDocument__title mb-2 font-bold text-2xl tracking-widest">
                    {value.title || '경력 기술서'}
                </h2>
                <p className="mb-2 text-base font-medium">총 경력 {totalCareerDuration}</p>
            </div>
            <div className="careerSummaryDocument__body border-t-2 border-t-black">
                {value.experiences.map((section) => {
                    const durationEndDate = section.isCurrent ? getCurrentYearMonth() : section.endDate;
                    const duration = getCareerDuration(section.startDate, durationEndDate);
                    const visibleTechStack = section.techStack.filter((tech) => tech.trim())
                    const articleTitleId = `career-summary-preview-${section.id}-title`;

                    return (
                        <article
                            key={section.id}
                            aria-labelledby={articleTitleId}
                            className="grid grid-cols-[170px_auto] gap-6 py-5 border-b border-b-black break-inside-avoid"
                        >
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
                                        <h3 id={articleTitleId} className="">
                                            {section.company || '회사명'}
                                        </h3>
                                        <div aria-hidden="true" className="inline-block w-px h-3 bg-muted-foreground/30"></div>
                                        <p className="flex gap-2 items-center">
                                            <span>{section.team}</span>  <span>{section.role}</span>
                                        </p>
                                    </div>
                                    <h4 className="mt-1.5 text-base text-muted-foreground">
                                        {section.responsibilities}
                                    </h4>
                                </div>
                                <ul className="grid break-keep mt-3 leading-relaxed">
                                    {section.achievements.map((achievement, index) => (
                                        <li key={`${section.id}-achievement-${index}`}>
                                            <p className="flex">
                                                <IconDot aria-hidde="true" className="-mt-0.5 size-6" /> {achievement.title || '주요성과 1'}
                                            </p>
                                            {achievement.description && (
                                                <div className="mb-4 pl-6 whitespace-pre-line font-light">
                                                    {achievement.description}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {visibleTechStack.length > 0 && (
                                    <div>
                                        <p className="flex">
                                            <IconDot aria-hidde="true" className="-mt-0.5 size-6" /> Skill Keywords
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
