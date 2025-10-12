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

const toLocaleTag = (locale?: string | null) =>
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
