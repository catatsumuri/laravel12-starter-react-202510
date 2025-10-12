<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();

        if ($user) {
            $user->loadMissing('roles:id,name');
        }

        $locale = app()->getLocale();
        $fallbackLocale = config('app.fallback_locale');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => $locale,
            'fallbackLocale' => $fallbackLocale,
            'availableLocales' => config('app.available_locales', []),
            'translations' => $this->frontendTranslations($locale),
            'fallbackTranslations' => $fallbackLocale !== $locale
                ? $this->frontendTranslations($fallbackLocale)
                : [],
            'csrf_token' => csrf_token(),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'notifications' => $this->notificationFeed($user),
            'flash' => [
                'success' => fn () => $request->session()->get('success') ?? $request->session()->get('status'),
                'error' => fn () => $request->session()->get('error') ?? $request->session()->get('danger'),
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function notificationFeed(?User $user): array
    {
        if (! $user) {
            return [];
        }

        return $user->notifications()
            ->latest('created_at')
            ->get()
            ->map(fn (DatabaseNotification $notification) => [
                'id' => (string) $notification->id,
                'type' => $notification->data['type'] ?? 'info',
                'title' => $notification->data['title'] ?? 'Notification',
                'message' => $notification->data['message'] ?? '',
                'time' => optional($notification->created_at)?->diffForHumans() ?? '',
                'read' => ! is_null($notification->read_at),
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function frontendTranslations(string $locale): array
    {
        $translations = Lang::get('frontend', [], $locale);

        return is_array($translations) ? $translations : [];
    }
}
