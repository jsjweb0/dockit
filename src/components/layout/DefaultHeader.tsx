import { Search, CircleX, SlidersHorizontal } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group.tsx';

export function DefaultHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <div className="mx-auto flex items-center max-w-7xl gap-4 md:gap-8 py-3">
        <h1 className="shrink-0">
          <a href="/" className="inline-flex md:min-h-10 items-center">
            <img src="/logo.svg" className="h-4.5 md:h-6 w-auto" alt="DocKit" />
          </a>
        </h1>
        <InputGroup>
          <InputGroupInput
            placeholder="문서 양식 검색"
            aria-label="문서 양식 검색"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" aria-label="검색어 지우기">
              <CircleX className="size-5" />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="ghost"
              size="icon-sm"
              aria-label="검색 필터"
            >
              <SlidersHorizontal />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </header>
  );
}
