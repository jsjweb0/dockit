type ExportDocumentPdfOptions = {
  fileName: string;
};

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
  void document.body.offsetHeight;

  window.addEventListener('afterprint', restore);
  window.print();
}
