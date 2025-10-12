import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

import {
  DEFAULT_DATETIME_FORMAT_OPTIONS,
  formatDateTimeString,
} from '@/lib/datetime';
import { type SharedData } from '@/types';

export const useDateFormatter = (
  options?: Partial<Intl.DateTimeFormatOptions>,
) => {
  const { locale, timezone } = usePage<SharedData>().props;

  const formattedOptions = useMemo(() => {
    if (!options) {
      return DEFAULT_DATETIME_FORMAT_OPTIONS;
    }

    return {
      ...DEFAULT_DATETIME_FORMAT_OPTIONS,
      ...options,
    } satisfies Intl.DateTimeFormatOptions;
  }, [options]);

  return useCallback(
    (value?: string | null) =>
      formatDateTimeString(value, locale, timezone, formattedOptions),
    [formattedOptions, locale, timezone],
  );
};
