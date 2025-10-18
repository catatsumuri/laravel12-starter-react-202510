const DEFAULT_LOCALE = 'ja-JP';
const DEFAULT_TIMEZONE = 'UTC';

export const DEFAULT_DATETIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: DEFAULT_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

export const toLocaleTag = (locale?: string | null) =>
  locale ? locale.replace('_', '-') : DEFAULT_LOCALE;

export const normalizeTimezone = (value?: string | null) =>
  value && value.length > 0 ? value : DEFAULT_TIMEZONE;

export const formatDateTimeString = (
  value: string | null | undefined,
  locale?: string | null,
  timezone?: string | null,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATETIME_FORMAT_OPTIONS,
): string => {
  if (!value) {
    return '—';
  }

  const intlLocale = toLocaleTag(locale);
  const intlTimezone = normalizeTimezone(timezone);

  try {
    return new Date(value).toLocaleString(intlLocale, {
      ...DEFAULT_DATETIME_FORMAT_OPTIONS,
      ...options,
      timeZone: intlTimezone,
    });
  } catch {
    return value;
  }
};

export const formatRelativeTimeString = (
  value: string | null | undefined,
  locale?: string | null,
): string => {
  if (!value) {
    return '—';
  }

  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return value;
  }

  const intlLocale = toLocaleTag(locale);
  const formatter = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = Math.round((target.getTime() - now.getTime()) / 1000);

  const divisions: Array<{
    amount: number;
    unit: Intl.RelativeTimeFormatUnit;
  }> = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.34524, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Number.POSITIVE_INFINITY, unit: 'year' },
  ];

  let duration = diffInSeconds;

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }

    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), 'year');
};
