import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
    Achievement,
    CareerExperience,
    CareerSummary,
} from '../model/careerSummary.types';
import { Fragment } from 'react/jsx-runtime';
import { Plus, ChevronDown } from 'lucide-react';
import { cn, createId } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { SkillTagEditor } from '@/features/shared/ui/SkillTagEditor';
import { useState } from 'react';
import type {
    CareerSummaryExperienceErrors,
    CareerSummaryExperienceField,
} from '../model/careerSummary.validation';

type Props = {
    value: CareerSummary;
    onChange: (next: CareerSummary) => void;
    errors?: Record<string, CareerSummaryExperienceErrors>;
    onSectionBlur?: (
        sectionId: string,
        field: CareerSummaryExperienceField,
        next: CareerSummary,
    ) => void;
    onSectionChange?: (
        sectionId: string,
        field: CareerSummaryExperienceField,
        next: CareerSummary,
    ) => void;
};

export function CareerSummaryForm({
    value,
    onChange,
    errors,
    onSectionBlur,
    onSectionChange,
}: Props) {
    const createEmptyAchievement = (): Achievement => ({
        title: '',
        description: '',
    });

    const updateExperience = (
        sectionId: string,
        patch: Partial<CareerExperience>,
        fields: CareerSummaryExperienceField[] = [],
    ) => {
        const nextValue = {
            ...value,
            experiences: value.experiences.map((section) =>
                section.id === sectionId ? { ...section, ...patch } : section,
            ),
        };

        onChange(nextValue);
        fields.forEach((field) => {
            onSectionChange?.(sectionId, field, nextValue);
        });
    };

    const addExperience = () => {
        onChange({
            ...value,
            experiences: [
                {
                    id: createId(),
                    company: '',
                    team: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    isCurrent: false,
                    responsibilities: '',
                    achievements: [createEmptyAchievement()],
                    techStack: [],
                },
                ...value.experiences,
            ],
        });
    };

    const updateAchievement = (
        sectionId: string,
        achievementIndex: number,
        patch: Partial<Achievement>,
    ) => {
        const experience = value.experiences.find(
            (section) => section.id === sectionId,
        );

        if (!experience) return;

        updateExperience(sectionId, {
            achievements: experience.achievements.map((achievement, index) =>
                index === achievementIndex
                    ? { ...achievement, ...patch }
                    : achievement,
            ),
        }, ['achievements']);
    };

    const [openAchievementKey, setOpenAchievementKey] = useState<string | null>(null);

    const addAchievement = (sectionId: string) => {
        const experience = value.experiences.find(
            (section) => section.id === sectionId,
        );

        if (!experience) return;

        const newAchievementIndex = experience.achievements.length;

        updateExperience(sectionId, {
            achievements: [...experience.achievements, createEmptyAchievement()],
        }, ['achievements']);

        setOpenAchievementKey(`${sectionId}-${newAchievementIndex}`);
    };

    const removeAchievement = (
        sectionId: string,
        achievementIndex: number,
    ) => {
        const experience = value.experiences.find(
            (section) => section.id === sectionId,
        );

        if (!experience || experience.achievements.length <= 1) return;

        updateExperience(sectionId, {
            achievements: experience.achievements.filter(
                (_, index) => index !== achievementIndex,
            ),
        }, ['achievements']);
    };

    const removeExperience = (sectionId: string) => {
        onChange({
            ...value,
            experiences: value.experiences.filter(
                (section) => section.id !== sectionId,
            ),
        });
    };

    return (
        <FieldSet>
            <FieldLegend>{value.title || '경력기술서'}</FieldLegend>
            <FieldDescription>
                회사별 역할, 주요 업무, 성과를 경력 중심으로 정리해 주세요.
            </FieldDescription>
            <FieldSeparator />
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="career-summary-title" className="font-bold">
                        경력기술서 제목
                    </FieldLabel>
                    <Input
                        id="career-summary-title"
                        value={value.title}
                        onChange={(event) =>
                            onChange({ ...value, title: event.target.value })
                        }
                        placeholder="예: 프론트엔드 경력기술서"
                    />
                </Field>
            </FieldGroup>
            <div className="flex items-center justify-between gap-3">
                <FieldDescription>
                    경력을 추가하면 새 항목이 위에 배치됩니다.
                </FieldDescription>
                <Button
                    type="button"
                    variant="outline"
                    className="gap-1"
                    onClick={addExperience}
                >
                    <Plus aria-hidden="true" /> 경력 추가
                </Button>
            </div>

            {value.experiences.map((section, index) => {
                const companyId = `career-summary-company-${section.id}`;
                const teamId = `career-summary-team-${section.id}`;
                const roleId = `career-summary-role-${section.id}`;
                const startDateId = `career-summary-startDate-${section.id}`;
                const endDateId = `career-summary-endDate-${section.id}`;
                const responsibilitiesId = `career-summary-responsibilities-${section.id}`;
                const groupTitleId = `career-summary-experience-${section.id}-title`;
                const sectionErrors = errors?.[section.id] ?? {}

                return (
                    <Fragment key={section.id}>
                        <FieldGroup
                            role="group"
                            aria-labelledby={groupTitleId}
                            className="rounded-lg border p-4 gap-6 has-focus-visible:border-gray-300 has-focus-visible:shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div id={groupTitleId} className="font-medium">
                                    경력 {value.experiences.length - index}
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => removeExperience(section.id)}
                                    disabled={value.experiences.length <= 1}
                                    aria-label={`경력 ${value.experiences.length - index} 삭제`}
                                >
                                    삭제
                                </Button>
                            </div>
                            <div className="grid gap-3 grid-cols-[auto_70px] items-start">
                                <Field data-invalid={!!sectionErrors.company}>
                                    <FieldLabel htmlFor={companyId}>회사명</FieldLabel>
                                    <Input
                                        id={companyId}
                                        value={section.company}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                company: event.target.value,
                                            }, ['company'])
                                        }
                                        onBlur={() => onSectionBlur?.(section.id, 'company', value)}
                                        placeholder="회사명"
                                        autoComplete="organization"
                                        aria-invalid={!!sectionErrors.company}
                                        aria-describedby={
                                            sectionErrors.company ? `${companyId}-error` : undefined
                                        }
                                    />
                                    {sectionErrors.company && (
                                        <FieldError id={`${companyId}-error`}>
                                            {sectionErrors.company}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field orientation="horizontal" className="mt-10">
                                    <Checkbox
                                        id={`isCurrent-${section.id}`}
                                        checked={section.isCurrent}
                                        onCheckedChange={(checked) => {
                                            const isCurrent = checked === true;

                                            const nextValue = {
                                                ...value,
                                                experiences: value.experiences.map((item) => {
                                                    if (item.id === section.id) {
                                                        return {
                                                            ...item,
                                                            isCurrent,
                                                            endDate: isCurrent ? '' : item.endDate,
                                                        };
                                                    }

                                                    return isCurrent ? { ...item, isCurrent: false } : item;
                                                }),
                                            };

                                            onChange(nextValue);
                                            onSectionChange?.(section.id, 'endDate', nextValue);
                                        }}
                                        className="peer"
                                    />
                                    <FieldLabel
                                        htmlFor={`isCurrent-${section.id}`}
                                        className="text-sm text-muted-foreground peer-data-[state=checked]:text-black"
                                    >
                                        재직 중
                                    </FieldLabel>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Field data-invalid={!!sectionErrors.startDate}>
                                    <FieldLabel htmlFor={startDateId}>시작일</FieldLabel>
                                    <Input
                                        id={startDateId}
                                        type="month"
                                        name="startDate"
                                        value={section.startDate}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                startDate: event.target.value,
                                                endDate:
                                                    section.endDate &&
                                                        section.endDate < event.target.value
                                                        ? ''
                                                        : section.endDate,
                                            }, ['startDate', 'endDate'])
                                        }
                                        onBlur={() => onSectionBlur?.(section.id, 'startDate', value)}
                                        placeholder="2026.01"
                                        autoComplete="off"
                                        aria-invalid={!!sectionErrors.startDate}
                                        aria-describedby={
                                            sectionErrors.startDate ? `${startDateId}-error` : undefined
                                        }
                                    />
                                    {sectionErrors.startDate && (
                                        <FieldError id={`${startDateId}-error`}>
                                            {sectionErrors.startDate}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!sectionErrors.endDate}>
                                    <FieldLabel htmlFor={endDateId}>종료일</FieldLabel>
                                    <Input
                                        id={endDateId}
                                        type="month"
                                        name="endDate"
                                        value={section.endDate ?? ''}
                                        min={section.startDate}
                                        disabled={section.isCurrent}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                endDate: event.target.value,
                                            }, ['endDate'])
                                        }
                                        onBlur={() => onSectionBlur?.(section.id, 'endDate', value)}
                                        placeholder="2026.01"
                                        autoComplete="off"
                                        aria-invalid={!!sectionErrors.endDate}
                                        aria-describedby={
                                            sectionErrors.endDate ? `${endDateId}-error` : undefined
                                        }
                                    />
                                    {sectionErrors.endDate && (
                                        <FieldError id={`${endDateId}-error`}>
                                            {sectionErrors.endDate}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Field>
                                    <FieldLabel htmlFor={teamId}>소속/팀</FieldLabel>
                                    <Input
                                        id={teamId}
                                        value={section.team}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                team: event.target.value,
                                            })
                                        }
                                        placeholder="소속/팀"
                                        autoComplete="off"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor={roleId}>직책</FieldLabel>
                                    <Input
                                        id={roleId}
                                        value={section.role}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                role: event.target.value,
                                            })
                                        }
                                        placeholder="직책"
                                        autoComplete="organization-title"
                                    />
                                </Field>
                            </div>
                            <Field data-invalid={!!sectionErrors.responsibilities}>
                                <FieldLabel htmlFor={responsibilitiesId}>주요 업무</FieldLabel>
                                <Input
                                    id={responsibilitiesId}
                                    value={section.responsibilities}
                                    onChange={(event) =>
                                        updateExperience(section.id, {
                                            responsibilities: event.target.value,
                                        }, ['responsibilities'])
                                    }
                                    onBlur={() => onSectionBlur?.(section.id, 'responsibilities', value)}
                                    placeholder="주요 업무를 작성해 주세요."
                                    autoComplete="off"
                                    aria-invalid={!!sectionErrors.responsibilities}
                                    aria-describedby={
                                        sectionErrors.responsibilities ? `${responsibilitiesId}-error` : undefined
                                    }
                                />
                                {sectionErrors.responsibilities && (
                                    <FieldError id={`${responsibilitiesId}-error`}>
                                        {sectionErrors.responsibilities}
                                    </FieldError>
                                )}
                            </Field>
                            <div>
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <FieldDescription>
                                        성과는 결과가 보이도록 제목과 설명을 나눠 작성해 주세요.
                                    </FieldDescription>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                        onClick={() => addAchievement(section.id)}
                                    >
                                        <Plus aria-hidden="true" /> 성과 추가
                                    </Button>
                                </div>
                                {section.achievements.map((achievement, achievementIndex) => {
                                    const achievementNumber = achievementIndex + 1;
                                    const achievementTitleId = `career-summary-achievement-title-${section.id}-${achievementIndex}`;
                                    const achievementDescriptionId = `career-summary-achievement-description-${section.id}-${achievementIndex}`;
                                    const achievementKey = `${section.id}-${achievementIndex}`;

                                    return (
                                        <Collapsible key={`${section.id}-achievement-${achievementIndex}`}
                                            open={openAchievementKey === achievementKey}
                                            onOpenChange={(open) => {
                                                setOpenAchievementKey(open ? achievementKey : null)
                                            }}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button variant="outline" className={cn(
                                                    'group w-full mt-2 text-sm text-left font-medium data-[state=open]:bg-muted/40',
                                                    sectionErrors.achievements && 'text-destructive border-destructive'
                                                )}>
                                                    성과 {achievementNumber}
                                                    <ChevronDown aria-hidden="true" className="ml-auto group-data-[state=open]:rotate-180" />
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="mt-2">
                                                <FieldGroup className="gap-5 rounded-md border bg-muted/40 p-3">
                                                    <Field data-invalid={!!sectionErrors.achievements} className="gap-1">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <FieldLabel htmlFor={achievementTitleId}>
                                                                주요성과 {achievementNumber}
                                                            </FieldLabel>
                                                            <Button
                                                                type="button"
                                                                variant="link"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeAchievement(
                                                                        section.id,
                                                                        achievementIndex,
                                                                    )
                                                                }
                                                                disabled={section.achievements.length <= 1}
                                                                aria-label={`성과 ${achievementNumber} 삭제`}
                                                            >
                                                                삭제
                                                            </Button>
                                                        </div>
                                                        <Input
                                                            id={achievementTitleId}
                                                            value={achievement.title}
                                                            onChange={(event) =>
                                                                updateAchievement(
                                                                    section.id,
                                                                    achievementIndex,
                                                                    { title: event.target.value },
                                                                )
                                                            }
                                                            placeholder="예: 문서 작성 흐름 개선 및 저장 안정성 강화"
                                                            autoComplete="off"
                                                            className="bg-white"
                                                            aria-invalid={!!sectionErrors.achievements}
                                                            aria-describedby={
                                                                sectionErrors.achievements ? `${achievementTitleId}-error` : undefined
                                                            }
                                                        />
                                                        {sectionErrors.achievements && (
                                                            <FieldError id={`${achievementTitleId}-error`}>
                                                                {sectionErrors.achievements}
                                                            </FieldError>
                                                        )}
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor={achievementDescriptionId}>
                                                            주요성과 설명
                                                        </FieldLabel>
                                                        <Textarea
                                                            id={achievementDescriptionId}
                                                            value={achievement.description}
                                                            onChange={(event) =>
                                                                updateAchievement(
                                                                    section.id,
                                                                    achievementIndex,
                                                                    { description: event.target.value },
                                                                )
                                                            }
                                                            placeholder="성과의 배경, 맡은 역할, 개선 결과를 작성해 주세요."
                                                            className="min-h-24 resize-none bg-background"
                                                            autoComplete="off"
                                                        />
                                                    </Field>
                                                </FieldGroup>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                })}
                            </div>
                            <SkillTagEditor
                                inputId={`career-summary-tech-stack-${section.id}`}
                                label="보유 기술"
                                listLabel={`${section.company || "경력"}에 등록된 보유 기술`}
                                placeholder="예: React"
                                skills={section.techStack}
                                onChange={(nextSkills) =>
                                    updateExperience(section.id, {
                                        techStack: nextSkills,
                                    })
                                }
                            />
                        </FieldGroup>
                        <FieldSeparator />
                    </Fragment>
                )
            })
            }
        </FieldSet>
    );
}
