/** Tailwind `lg` breakpoint — editor preview mobile/desktop 구분 */
export const MOBILE_PREVIEW_QUERY = '(max-width: 1024px)';

export function isMobilePreviewViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_PREVIEW_QUERY).matches;
}

export function getInitialPreviewOpen() {
  return !isMobilePreviewViewport();
}
