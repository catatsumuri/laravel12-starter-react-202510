<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        if ($appName = Setting::value('app.name')) {
            config(['app.name' => $appName]);
        }

        if ($timezone = Setting::value('app.timezone')) {
            config(['app.timezone' => $timezone]);
            date_default_timezone_set($timezone);
        }

        $this->syncBooleanSetting('app.allow_registration', 'app.allow_registration');
        $this->syncBooleanSetting('app.allow_appearance_customization', 'app.allow_appearance_customization');
        $this->syncAppearanceSetting();
        $this->syncLocale();
    }

    protected function syncBooleanSetting(string $settingKey, string $configKey): void
    {
        $value = Setting::value($settingKey);

        if (is_null($value)) {
            return;
        }

        config([$configKey => filter_var($value, FILTER_VALIDATE_BOOL)]);
    }

    protected function syncAppearanceSetting(): void
    {
        $value = Setting::value('app.default_appearance');

        if (is_null($value)) {
            return;
        }

        $allowed = ['light', 'dark', 'system'];

        if (! in_array($value, $allowed, true)) {
            return;
        }

        config(['app.default_appearance' => $value]);
    }

    protected function syncLocale(): void
    {
        $locale = Setting::value('app.locale');

        if (! is_null($locale) && in_array($locale, config('app.available_locales', []), true)) {
            config(['app.locale' => $locale]);
            app()->setLocale($locale);
        }
    }
}
