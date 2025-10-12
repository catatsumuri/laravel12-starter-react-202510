import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { configureI18n } from './lib/i18n';
import { type SharedData } from './types';

const initialDocumentTitle =
  typeof document !== 'undefined'
    ? document.querySelector('title[inertia]')?.textContent?.trim()
    : null;
const defaultAppName =
  initialDocumentTitle ||
  import.meta.env.VITE_APP_NAME ||
  'Laravel';

const resolveAppName = (props: unknown): string | null => {
  if (!props || typeof props !== 'object') {
    return null;
  }

  const name = (props as Partial<SharedData>).name;

  return typeof name === 'string' && name.length > 0 ? name : null;
};

let currentAppName = defaultAppName;

const applyLocalization = (props: unknown) => {
  if (!props || typeof props !== 'object') {
    return;
  }

  const data = props as Partial<SharedData>;
  const locale =
    typeof data.locale === 'string' && data.locale.length > 0
      ? data.locale
      : null;

  if (!locale) {
    return;
  }

  const fallbackLocale =
    typeof data.fallbackLocale === 'string' && data.fallbackLocale.length > 0
      ? data.fallbackLocale
      : locale;

  configureI18n(
    locale,
    fallbackLocale,
    data.translations as Record<string, unknown>,
    data.fallbackTranslations as Record<string, unknown>,
  );
};

router.on('navigate', (event) => {
  const nextName = resolveAppName(event.detail.page.props);

  if (nextName) {
    currentAppName = nextName;
  }

  applyLocalization(event.detail.page.props);
});

createInertiaApp({
  title: (title) =>
    title ? `${title} - ${currentAppName}` : currentAppName,
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    const resolved = resolveAppName(props.initialPage.props);

    if (resolved) {
      currentAppName = resolved;
    }

    applyLocalization(props.initialPage.props);

    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});

// This will set light / dark mode on load...
initializeTheme();
