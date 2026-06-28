import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
    Achievement,
    CareerExperience,
    CareerSummary,
} from '../model/careerSummary.types';
import { Fragment } from 'react/jsx-runtime';
import { Plus } from 'lucide-react';
import { createId } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
    value: CareerSummary;
    onChange: (next: CareerSummary) => void;
    onSectionBlur?: (sectionId: string) => void;
    onSectionChange?: (sectionId: string, next: CareerSummary) => void;
};

export function CareerSummaryForm({
    value,
    onChange,
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
    ) => {
        const nextValue = {
            ...value,
            experiences: value.experiences.map((section) =>
                section.id === sectionId ? { ...section, ...patch } : section,
            ),
        };

        onChange(nextValue);
        onSectionChange?.(sectionId, nextValue);
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
        });
    };

    const addAchievement = (sectionId: string) => {
        const experience = value.experiences.find(
            (section) => section.id === sectionId,
        );

        if (!experience) return;

        updateExperience(sectionId, {
            achievements: [...experience.achievements, createEmptyAchievement()],
        });
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
        });
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
                <Field>
                    <FieldLabel htmlFor="career-summary-tech-stack" className="font-bold">
                        보유 기술
                    </FieldLabel>
                    <Textarea
                        id="career-summary-tech-stack"
                        value={value.techStack}
                        onChange={(event) =>
                            onChange({ ...value, techStack: event.target.value })
                        }
                        placeholder="예: React, TypeScript, JavaScript, HTML, CSS, Git"
                        className="min-h-24 resize-none"
                        autoComplete="off"
                    />
                </Field>

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

                    return (
                        <Fragment key={section.id}>
                            <FieldGroup className="rounded-lg border p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="font-medium">
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
                                <Field>
                                    <FieldLabel htmlFor={companyId}>회사명</FieldLabel>
                                    <Input
                                        id={companyId}
                                        value={section.company}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                company: event.target.value,
                                            })
                                        }
                                        onBlur={() => onSectionBlur?.(section.id)}
                                        placeholder="회사명"
                                        autoComplete="organization"
                                    />
                                </Field>
                                <div className="grid gap-3 grid-cols-[auto_auto_70px]">
                                    <Field>
                                        <FieldLabel htmlFor={startDateId}>시작일</FieldLabel>
                                        <Input
                                            id={startDateId}
                                            type="month"
                                            name="startDate"
                                            value={section.startDate}
                                            onChange={(event) =>
                                                updateExperience(section.id, {
                                                    startDate: event.target.value,
                                                })
                                            }
                                            placeholder="2026.01"
                                            autoComplete="off"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor={endDateId}>종료일</FieldLabel>
                                        <Input
                                            id={endDateId}
                                            type="month"
                                            name="endDate"
                                            value={section.endDate ?? ''}
                                            disabled={section.isCurrent}
                                            onChange={(event) =>
                                                updateExperience(section.id, {
                                                    endDate: event.target.value,
                                                })
                                            }
                                            placeholder="2026.01"
                                            autoComplete="off"
                                        />
                                    </Field>
                                    <Field orientation="horizontal" className="mt-8">
                                        <Checkbox
                                            id={`isCurrent-${section.id}`}
                                            checked={section.isCurrent}
                                            onCheckedChange={(checked) => {
                                                const isCurrent = checked === true;

                                                updateExperience(section.id, {
                                                    isCurrent,
                                                    endDate: isCurrent ? '' : section.endDate,
                                                });
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
                                <Field>
                                    <FieldLabel htmlFor={responsibilitiesId}>직무</FieldLabel>
                                    <Input
                                        id={responsibilitiesId}
                                        value={section.responsibilities}
                                        onChange={(event) =>
                                            updateExperience(section.id, {
                                                responsibilities: event.target.value,
                                            })
                                        }
                                        placeholder="주요 업무를 작성해 주세요."
                                        autoComplete="off"
                                    />
                                </Field>
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between gap-3">
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

                                        return (
                                            <FieldGroup
                                                key={`${section.id}-achievement-${achievementIndex}`}
                                                className="rounded-md border bg-muted/30 p-3"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="text-sm font-medium">
                                                        성과 {achievementNumber}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
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
                                                <Field>
                                                    <FieldLabel htmlFor={achievementTitleId}>
                                                        주요성과 {achievementNumber}
                                                    </FieldLabel>
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
                                                    />
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
                                                        className="min-h-32 resize-none bg-background"
                                                        autoComplete="off"
                                                    />
                                                </Field>
                                            </FieldGroup>
                                        );
                                    })}
                                </div>
                            </FieldGroup>
                            <FieldSeparator />
                        </Fragment>
                    )
                })
                }
            </FieldGroup>
        </FieldSet>
    );
}
