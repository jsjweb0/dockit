import { AlertTriangle } from 'lucide-react';

type DocumentValidationSummaryProps = {
  errorCount: number;
};

export function DocumentValidationSummary({
  errorCount,
}: DocumentValidationSummaryProps) {
  if (errorCount === 0) return null;

  return (
    <div
      className="mb-6 flex items-start gap-2 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 lg:mx-5 lg:mt-6"
      role="status"
    >
      <AlertTriangle
        className="mt-0.5 size-4 shrink-0"
        aria-hidden="true"
      />
      <p>
        검증 결과 <strong>{errorCount}</strong>개의 오류가 있습니다. 입력 항목을
        확인해주세요.
      </p>
    </div>
  );
}
