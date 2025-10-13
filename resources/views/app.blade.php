<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const allowAppearanceCustomization = {{ config('app.allow_appearance_customization') ? 'true' : 'false' }};
                const defaultAppearance = '{{ config('app.default_appearance', 'light') }}';
                const appearance = '{{ $appearance ?? "light" }}';

                window.__ALLOW_APPEARANCE_CUSTOMIZATION__ = allowAppearanceCustomization;
                window.__DEFAULT_APPEARANCE__ = defaultAppearance;

                if (!allowAppearanceCustomization) {
                    try {
                        localStorage.removeItem('appearance');
                    } catch (error) {
                        console.error('Failed to clear appearance preference from localStorage', error);
                    }

                    document.cookie = 'appearance=;path=/;max-age=0;SameSite=Lax';
                    const effectiveAppearance = defaultAppearance;

                    document.documentElement.classList.toggle('dark', effectiveAppearance === 'dark');
                    document.documentElement.style.colorScheme = effectiveAppearance === 'dark' ? 'dark' : 'light';

                    return;
                }

                const resolvedAppearance = appearance || defaultAppearance;
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (resolvedAppearance === 'dark' || (resolvedAppearance === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
