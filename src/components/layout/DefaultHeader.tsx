import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X as ClearX } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group.tsx';


export function DefaultHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(() =>
    searchParams.get('search') ?? '',
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const trimmedKeyword = keyword.trim();

      if (!trimmedKeyword) {
        navigate('/', { replace: true });
        return;
      }

      navigate(`/?search=${encodeURIComponent(trimmedKeyword)}`);
    }, 200);

    return () => window.clearTimeout(timerId);
  }, [keyword, navigate]);

  useEffect(() => {
    setKeyword(searchParams.get('search') ?? '');
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex items-center max-w-7xl gap-5 md:gap-8 py-3 px-4 md:px-8">
        <h1 className="shrink-0">
          <a href="/" className="inline-flex md:min-h-10 items-center">
            <img src="/logo.svg" className="h-3.5 md:h-5 w-auto" alt="DocKit" />
          </a>
        </h1>
        <div className="grow">
          <form>
            <InputGroup className="h-10 rounded-full">
              <label htmlFor="search" className="sr-only">검색어</label>
              <InputGroupInput
                type="search"
                id="search"
                name="search"
                placeholder="문서 양식 검색"
                aria-label="문서 양식 검색"
                autoComplete="off"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
              {keyword && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size="icon-sm" aria-label="검색어 지우기"
                    onClick={() => setKeyword('')}
                  >
                    <ClearX className="size-5 text-muted-foreground/50" />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </form>
        </div>
      </div>
    </header>
  );
}
