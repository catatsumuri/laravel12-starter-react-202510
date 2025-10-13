import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { type SharedData } from '@/types';

export type Appearance = 'light' | 'dark' | 'system';

declare global {
  interface Window {
    __ALLOW_APPEARANCE_CUSTOMIZATION__?: boolean;
    __DEFAULT_APPEARANCE__?: Appearance;
  }
}

const FALLBACK_APPEARANCE: Appearance = 'light';

const getDefaultAppearance = (): Appearance => {
  if (typeof window !== 'undefined') {
    const globalDefault = window.__DEFAULT_APPEARANCE__;

    if (globalDefault && ['light', 'dark', 'system'].includes(globalDefault)) {
      return globalDefault;
    }
  }

  return FALLBACK_APPEARANCE;
};

const prefersDark = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') {
    return;
  }

  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
  const isDark =
    appearance === 'dark' || (appearance === 'system' && prefersDark());

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const mediaQuery = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
  const currentAppearance = localStorage.getItem('appearance') as Appearance;
  applyTheme(currentAppearance || getDefaultAppearance());
};

export function initializeTheme() {
  const allowCustomization =
    typeof window === 'undefined'
      ? true
      : window.__ALLOW_APPEARANCE_CUSTOMIZATION__ !== false;

  let savedAppearance: Appearance = getDefaultAppearance();

  if (allowCustomization) {
    savedAppearance =
      (localStorage.getItem('appearance') as Appearance) ||
      getDefaultAppearance();
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
  } else {
    try {
      localStorage.removeItem('appearance');
    } catch (error) {
      console.error(
        'Failed to clear appearance preference from localStorage',
        error,
      );
    }

    removeCookie('appearance');
  }

  applyTheme(savedAppearance);
}

export function useAppearance() {
  const { allowAppearanceCustomization = true, defaultAppearance } =
    usePage<SharedData>().props;

  const effectiveDefault = useMemo<Appearance>(() => {
    if (
      defaultAppearance &&
      ['light', 'dark', 'system'].includes(defaultAppearance)
    ) {
      return defaultAppearance;
    }

    return getDefaultAppearance();
  }, [defaultAppearance]);

  const [appearance, setAppearance] = useState<Appearance>(effectiveDefault);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__DEFAULT_APPEARANCE__ = effectiveDefault;
    }
  }, [effectiveDefault]);

  const resetAppearance = useCallback(() => {
    setAppearance(effectiveDefault);

    try {
      localStorage.removeItem('appearance');
    } catch (error) {
      console.error(
        'Failed to clear appearance preference from localStorage',
        error,
      );
    }

    removeCookie('appearance');
    applyTheme(effectiveDefault);
  }, [effectiveDefault]);

  const updateAppearance = useCallback(
    (mode: Appearance) => {
      if (!allowAppearanceCustomization) {
        resetAppearance();
        return;
      }

      setAppearance(mode);

      try {
        localStorage.setItem('appearance', mode);
      } catch (error) {
        console.error(
          'Failed to store appearance preference in localStorage',
          error,
        );
      }

      setCookie('appearance', mode);

      applyTheme(mode);
    },
    [allowAppearanceCustomization, resetAppearance],
  );

  useEffect(() => {
    const savedAppearance = localStorage.getItem(
      'appearance',
    ) as Appearance | null;
    if (!allowAppearanceCustomization) {
      resetAppearance();
      return () => undefined;
    }

    updateAppearance(savedAppearance || effectiveDefault);

    return () =>
      mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
  }, [
    allowAppearanceCustomization,
    effectiveDefault,
    resetAppearance,
    updateAppearance,
  ]);

  return useMemo(
    () =>
      ({
        appearance,
        updateAppearance,
        allowAppearanceCustomization,
        defaultAppearance: effectiveDefault,
      }) as const,
    [
      appearance,
      updateAppearance,
      allowAppearanceCustomization,
      effectiveDefault,
    ],
  );
}
