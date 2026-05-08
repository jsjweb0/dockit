import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documentTemplates } from "@/features/documents/model/documentTemplates";

export function HomePage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <section className="grid gap-5 border-b py-18 mb-22">
                <Badge variant="secondary" className="w-fit">DocKit MVP</Badge>
                <div className="grid gap-3">
                    <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                        입력 폼으로 작성하고, <br />제출용 문서 레이아웃으로 바로 확인합니다.
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">
                        이력서부터 자기소개서, 경력기술서, 프로젝트 보고서까지 포트폴리오와 취업 준비에 필요한 문서를 한 곳에서 작성하는 React 문서 작성 도구입니다.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button asChild>
                        <Link to="/resume">
                            이력서 작성 시작
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="grid gap-4" aria-labelledby="template-heading">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 id="template-heading" className="text-2xl font-semibold">문서 양식</h2>
                        <p className="mt-1 text-muted-foreground">
                            먼저 이력서를 완성하고, 같은 구조로 양식을 확장할 예정입니다.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {documentTemplates.map((template) => {
                        const Icon = template.icon;
                        const content = (
                            <article className="flex h-full flex-col gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-primary/50">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="rounded-md border bg-background p-2">
                                        <Icon className="size-5" aria-hidden="true" />
                                    </span>
                                    <Badge variant={template.status === "available" ? "default" : "outline"}>
                                        {template.status === "available" ? "작성 가능" : "준비 중"}
                                    </Badge>
                                </div>
                                <div className="grid gap-2">
                                    <h3 className="text-lg font-semibold">{template.title}</h3>
                                    <p className="text-sm leading-6 text-muted-foreground">{template.description}</p>
                                </div>
                                <p className="mt-auto text-xs font-medium text-muted-foreground">{template.purpose}</p>
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
                            <Link key={template.id} to={template.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                {content}
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
