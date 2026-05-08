import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {ImageDownIcon, RefreshCcw, TriangleAlert} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {formatRelativeTime} from "@/utils/time.ts";
import {Spinner} from "@/components/ui/spinner";
import {Separator} from "@/components/ui/separator.tsx";
import {ConfirmDialog} from "@/components/ui/confirm-dialog.tsx";

type Props = {
    title: string;
    onSave: () => void;
    onReset: () => void;
    onBack: () => void;
    isDirty: boolean;
    isSaving: boolean;
    lastSavedAt: number | null;
};

export function EditorHeader({title, onSave, onReset, onBack, isDirty, isSaving, lastSavedAt}: Props) {
    const [, forceTick] = useState(0);

    useEffect(() => {
        if (!lastSavedAt) return;
        const id = setInterval(() => forceTick((v) => v + 1), 60_000);
        return () => clearInterval(id);
    }, [lastSavedAt]);

    const statusNode = useMemo(() => {
        if (isSaving) {
            return (
                <>
                    <Spinner/> 자동 저장 중…
                </>
            );
        }
        if (lastSavedAt) return formatRelativeTime(lastSavedAt);
        if (isDirty) {
            return (
                <>
                    <TriangleAlert className="size-4"/> 저장 필요
                </>
            )
        }
        return null;
    }, [isSaving, lastSavedAt, isDirty]);

    return (
        <header className="sticky top-0 z-20 border-b bg-background/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <h1 className="shrink-0">
                        <a href="/" className="inline-flex min-h-10 items-center">
                            <img src="/logo.svg" className="h-5 w-auto" alt="DocKit"/>
                        </a>
                    </h1>
                    <div className="flex items-center gap-2 min-w-0">
                        <p className="text-xs text-white bg-black rounded-full px-2 py-1">국문 이력서</p>
                        <strong className="font-normal truncate">{title || "새 이력서"}</strong>
                    </div>
                </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex min-h-9 items-center gap-1 text-sm text-muted-foreground">{statusNode}</span>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full" aria-label="이미지 저장" disabled>
                            <ImageDownIcon className="size-5"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm">이미지 저장 준비 중</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <ConfirmDialog
                        title="전체 초기화할까요?"
                        description="입력한 내용이 모두 초기화됩니다. 이 작업은 되돌릴 수 없어요."
                        confirmText="초기화"
                        onConfirm={onReset}
                        trigger={

                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full"
                                    aria-label="전체 초기화"
                                    disabled={!isDirty}
                                >
                                    <RefreshCcw/>
                                </Button>
                            </TooltipTrigger>


                        }
                    />
                    <TooltipContent>
                        <p className="text-sm">전체 초기화</p>
                    </TooltipContent>
                </Tooltip>

                <Separator orientation="vertical" className="mx-2 h-4!"/>

                <div className="flex gap-1">
                    <Button onClick={onSave} disabled={!isDirty || isSaving}>문서저장</Button>

                    {isDirty ? (
                        <ConfirmDialog
                            title="저장되지 않은 변경사항이 있어요"
                            description="지금 나가면 변경사항이 사라질 수 있어요. 그래도 나갈까요?"
                            confirmText="나가기"
                            onConfirm={onBack}
                            trigger={
                                <Button variant="outline" aria-label="이전 페이지">나가기</Button>
                            }
                        />
                    ) : (
                        <Button variant="outline" onClick={onBack} aria-label="이전 페이지">나가기</Button>
                    )}
                </div>
            </div>
            </div>
        </header>
    );
}
