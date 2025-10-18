import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';

import { formatRelativeTimeString } from '@/lib/datetime';
import { type SharedData } from '@/types';

export const useRelativeTimeFormatter = () => {
  const { locale } = usePage<SharedData>().props;

  return useCallback(
    (value?: string | null) => formatRelativeTimeString(value, locale),
    [locale],
  );
};
