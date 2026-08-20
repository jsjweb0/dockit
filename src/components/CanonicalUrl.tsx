import { useEffect } from 'react';

const SITE_URL = 'https://dockit.jsjweb0.workers.dev';

interface CanonicalUrlProps {
  path: string;
}

export function CanonicalUrl({ path }: CanonicalUrlProps) {
  useEffect(() => {
    let canonicalLink = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.append(canonicalLink);
    }

    canonicalLink.href = new URL(path, SITE_URL).href;
  }, [path]);

  return null;
}
