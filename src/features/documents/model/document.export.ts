type ExportDocumentImageOptions = {
  fileName: string;
  target: HTMLElement;
};

type ExportDocumentPdfOptions = {
  fileName: string;
};

function collectDocumentStyles() {
  return Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .filter(Boolean)
    .join('\n');
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

// 이미지 내보내기
export async function exportDocumentImage({
  fileName,
  target,
}: ExportDocumentImageOptions) {
  const width = Math.ceil(target.offsetWidth);
  const height = Math.ceil(target.offsetHeight);
  const clone = target.cloneNode(true) as HTMLElement;

  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  clone.style.width = `${width}px`;
  clone.style.minHeight = `${height}px`;
  clone.style.margin = '0';
  clone.style.background = '#fff';

  const html = new XMLSerializer().serializeToString(clone);
  const styles = collectDocumentStyles();
  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    <style>${styles}</style>
                    ${html}
                </div>
            </foreignObject>
        </svg>
    `;

  const image = new Image();
  const svgUrl = URL.createObjectURL(
    new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
  );

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('이미지 변환에 실패했습니다.'));
    image.src = svgUrl;
  });

  const scale = Math.max(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext('2d');
  if (!context) {
    URL.revokeObjectURL(svgUrl);
    throw new Error('이미지 저장을 지원하지 않는 브라우저입니다.');
  }

  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(svgUrl);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  );
  if (!blob) throw new Error('PNG 파일 생성에 실패했습니다.');

  downloadBlob(blob, fileName);
}

// pdf 내보내기
export function exportDocumentPdf({ fileName }: ExportDocumentPdfOptions) {
  const originalTitle = document.title;

  const restore = () => {
    document.body.classList.remove('printing');
    document.title = originalTitle;
    window.removeEventListener('afterprint', restore);
  };

  document.title = fileName.replace('.pdf', '');
  document.body.classList.add('printing');

  window.addEventListener('afterprint', restore);
  window.print();
}
