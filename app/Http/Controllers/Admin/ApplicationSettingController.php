<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Carbon\CarbonTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings/index', [
            'appName' => Setting::value('app.name', config('app.name')),
            'allowRegistration' => config('app.allow_registration'),
            'allowAppearanceCustomization' => config('app.allow_appearance_customization'),
            'allowTwoFactorAuthentication' => config('app.allow_two_factor_authentication'),
            'defaultAppearance' => config('app.default_appearance', 'light'),
            'appDebug' => config('app.debug'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $availableTimezones = config('app.available_timezones', []);
        $availableLocales = config('app.available_locales', []);

        $validated = $request->validate([
            'app_name' => ['required', 'string', 'max:255'],
            'allow_registration' => ['nullable', 'boolean'],
            'allow_appearance_customization' => ['nullable', 'boolean'],
            'allow_two_factor_authentication' => ['nullable', 'boolean'],
            'locale' => ['required', 'string', Rule::in($availableLocales)],
            'default_appearance' => ['required', 'string', Rule::in(['light', 'dark', 'system'])],
            'timezone' => [
                'nullable',
                'string',
                Rule::requiredIf(! empty($availableTimezones)),
                Rule::in($availableTimezones),
            ],
        ]);

        $appName = $validated['app_name'];
        $allowRegistration = $request->boolean('allow_registration');
        $allowAppearanceCustomization = $request->boolean('allow_appearance_customization');
        $allowTwoFactorAuthentication = $request->boolean('allow_two_factor_authentication');
        Setting::updateValue('app.allow_appearance_customization', $allowAppearanceCustomization ? '1' : '0');
        Setting::updateValue('app.allow_two_factor_authentication', $allowTwoFactorAuthentication ? '1' : '0');
        $defaultAppearance = $validated['default_appearance'];
        $locale = $validated['locale'];
        $timezone = $validated['timezone'] ?? null;

        Setting::updateValue('app.name', $appName);
        Setting::updateValue('app.allow_registration', $allowRegistration ? '1' : '0');
        Setting::updateValue('app.default_appearance', $defaultAppearance);

        config(['app.name' => $appName]);
        config(['app.allow_registration' => $allowRegistration]);
        config(['app.allow_appearance_customization' => $allowAppearanceCustomization]);
        config(['app.allow_two_factor_authentication' => $allowTwoFactorAuthentication]);
        config(['app.default_appearance' => $defaultAppearance]);

        app()->setLocale($locale);
        Setting::updateValue('app.locale', $locale);
        $request->session()->put('locale', $locale);

        if ($timezone) {
            $this->updateTimezoneSetting($timezone);
        }

        return back()->with('success', __('admin.settings.application_updated'));
    }

    public function updateTimezone(Request $request): RedirectResponse
    {
        $availableTimezones = config('app.available_timezones', []);

        $validated = $request->validate([
            'timezone' => ['required', 'string', Rule::in($availableTimezones)],
        ]);

        $timezone = $validated['timezone'];
        $this->updateTimezoneSetting($timezone);

        return back()->with('success', __('admin.settings.timezone_updated'));
    }

    protected function updateTimezoneSetting(string $timezone): void
    {
        Setting::updateValue('app.timezone', $timezone);

        config(['app.timezone' => $timezone]);
        $connection = config('database.default');
        $offset = CarbonTimeZone::create($timezone)->toOffsetName();
        config(["database.connections.{$connection}.timezone" => $offset]);
        date_default_timezone_set($timezone);

        $driver = config("database.connections.{$connection}.driver");

        if ($driver !== 'sqlite') {
            $database = DB::connection($connection);

            if ($driver === 'pgsql') {
                $database->statement("SET TIME ZONE '{$timezone}'");
            } elseif (in_array($driver, ['mysql', 'mariadb'])) {
                $database->statement("SET time_zone = '{$offset}'");
            }
        }
    }
}
