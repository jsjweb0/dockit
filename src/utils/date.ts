const YEAR_MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export function isValidYearMonth(value: string) {
  return YEAR_MONTH_REGEX.test(value);
}

export function parseYearMonthToIndex(value: string) {
  if (!isValidYearMonth(value)) return null;

  const [year, month] = value.split('-').map(Number);
  return year * 12 + month;
}

const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function isValidDate(value: string) {
  if (!DATE_REGEX.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
