import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

import { type SharedData } from './types';

const defaultAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

const resolveAppName = (props: unknown): string | null => {
  if (!props || typeof props !== 'object') {
    return null;
  }

  const name = (props as Partial<SharedData>).name;

  return typeof name === 'string' && name.length > 0 ? name : null;
};

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => {
      const appName = resolveAppName(page.props) ?? defaultAppName;

      return title ? `${title} - ${appName}` : appName;
    },
    resolve: (name) =>
      resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx'),
      ),
    setup: ({ App, props }) => {
      return <App {...props} />;
    },
  }),
);
