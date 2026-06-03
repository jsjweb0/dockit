import { Button } from '@/components/ui/button';

export function ErrorFallback() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-semibold">문제가 발생했습니다.</p>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                화면을 불러오는 중 오류가 발생했습니다.
                <br />새로고침하거나 홈으로 돌아가 다시 시도해 주세요.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                    새로고침
                </Button>
                <Button type="button" onClick={() => { window.location.href = '/'; }}>
                    홈으로 이동
                </Button>
            </div>
        </div>
    );
}