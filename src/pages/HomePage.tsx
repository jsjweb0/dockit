import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, Clock3, Trash2, Info as InfoIcon, RefreshCcw, Hash as HashIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { documentTemplates } from '@/layout/editor.config';
import {
  listRecentDocumentDrafts,
  type RecentDocumentDraft,
} from '@/features/documents/model/document.recent';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatRelativeTime } from '@/utils/time';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

export function HomePage() {
  usePageTitle();

  const [recentDrafts, setRecentDrafts] = useState<RecentDocumentDraft[]>(() =>
    listRecentDocumentDrafts(3),
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('search')?.trim() ?? '';
  const normalizedKeyword = keyword.toLowerCase();
  const recommendedKeywords = documentTemplates.map((template) => template.title);

  const filteredTemplates = documentTemplates.filter((template) => {
    if (!normalizedKeyword) return true;

    const searchText = [
      template.title,
      template.description,
      template.purpose,
      //...(template.keywords ?? []),
    ]
      .join(' ')
      .toLowerCase();

    return searchText.includes(normalizedKeyword);
  });

  const handleResetSearch = () => {
    setSearchParams({});
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!keyword && (
        <section className="grid gap-6 border-b py-10 pt-3 mb-10 md:py-18 md:mb-18">
          <Badge variant="secondary" className="w-fit">
            DocKit MVP
          </Badge>
          <div className="grid gap-4">
            <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl break-keep">
              입력하면서,<br />
              제출될 문서 형태를 바로 확인합니다.
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              최종 제출 형태를 보면서 이력서와 자기소개서를 작성할 수 있는 React 문서 작성 도구입니다.
            </p>
          </div>
          <div className="flex flex-wrap">
            <Button asChild>
              <Link to="/resume">
                이력서 작성 시작
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {!keyword && recentDrafts.length > 0 && (
        <section className="my-12 md:my-18 grid gap-4" aria-labelledby="recent-drafts-heading">
          <div>
            <h2 id="recent-drafts-heading" className="text-2xl font-semibold">
              최근 작성
            </h2>
            <p className="mt-1 text-muted-foreground">
              저장한 문서를 다시 열어 이어서 작성할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {recentDrafts.map((draft) => (
              <article key={draft.id} className={cn(
                'group grid grid-cols-[1fr_auto] h-full gap-3 rounded-lg border bg-card p-5',
                'transition-colors has-[a:hover]:border-ring has-[a:focus-visible]:ring-ring/50 has-[a:focus-visible]:ring-2',
              )}>
                <Link to={draft.href}
                  className="grid pt-1 focus-visible:outline-none"
                >
                  <Badge variant="secondary" className="w-fit mb-2.5">
                    {draft.documentLabel}
                  </Badge>
                  <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-primary">
                    {draft.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {draft.description}
                  </p>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`${draft.title} 삭제`}>
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>문서를 삭제할까요?</AlertDialogTitle>
                      <AlertDialogDescription>
                        저장된 문서와 최근 작성 목록에서 완전히 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>닫기</AlertDialogCancel>
                      <AlertDialogAction aria-label={`${draft.title} 삭제`} onClick={() => {
                        draft.deleteDraft(draft.id);
                        setRecentDrafts(listRecentDocumentDrafts(3));
                      }}>
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="col-span-2 flex gap-1 items-center justify-end text-xs font-medium text-muted-foreground">
                  <Clock3
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {formatRelativeTime(draft.updatedAt)}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {keyword && filteredTemplates.length === 0 ? (
        <div className="h-[calc(100dvh-(240px))] flex flex-col gap-3.5 justify-center items-center max-w-md m-auto text-center">
          <span className="inline-block rounded-full bg-muted p-2"><InfoIcon className="size-5" aria-hidden="true" /></span>
          <p className="mb-1 text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
            <span className="text-black text-lg">검색 결과가 없어요.</span> <br />다른 키워드로 검색해보세요.
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {recommendedKeywords.map((keyword) => (
              <Button key={keyword}
                type="button"
                variant="link"
                size="sm"
                className="gap-1 rounded-full"
                onClick={() => setSearchParams({ search: keyword })}
              >
                <HashIcon className="size-3.5" aria-hidden="true" />
                {keyword}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={handleResetSearch}>
            <RefreshCcw aria-hidden="true" />
            검색 초기화
          </Button>
        </div>
      ) : (
        <section className="grid gap-4 my-12 md:my-14 " aria-labelledby="template-heading">
          <div className={cn(keyword && 'mb-3 text-center')}>
            <h2 id="template-heading" className="text-2xl font-semibold">
              {keyword ? '문서 양식 검색 결과' : '새 문서 만들기'}
            </h2>
            {keyword ? (
              <p className="mt-1 text-muted-foreground"
                role='status'
                aria-live='polite'
                aria-atomic='true'
              >
                "<strong className="font-medium">{keyword}</strong>"에 대한 검색 결과{' '}
                {filteredTemplates.length}개입니다.
              </p>
            ) : (
              <p className="mt-1 text-muted-foreground">현재는 국문 이력서와 자기소개서를 지원합니다.</p>
            )}

          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;

              const content = (
                <article className="flex h-full flex-col gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-primary/50">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-md border bg-background p-2">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <Badge
                      variant={
                        template.status === 'available' ? 'default' : 'outline'
                      }
                    >
                      {template.status === 'available' ? 'Beta' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">{template.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                  <p className="mt-auto text-xs font-medium text-muted-foreground">
                    {template.purpose}
                  </p>
                </article>
              );

              if (!template.href) {
                return (
                  <div key={template.id} aria-disabled="true">
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={template.id}
                  to={template.href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
