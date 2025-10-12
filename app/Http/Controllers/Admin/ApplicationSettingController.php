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
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'app_name' => ['required', 'string', 'max:255'],
        ]);

        $appName = $validated['app_name'];

        Setting::updateValue('app.name', $appName);

        config(['app.name' => $appName]);

        return back()->with('success', 'Application name updated.');
    }

    public function updateLocale(Request $request): RedirectResponse
    {
        $availableLocales = config('app.available_locales', []);

        $validated = $request->validate([
            'locale' => ['required', 'string', Rule::in($availableLocales)],
        ]);

        $request->session()->put('locale', $validated['locale']);

        return back()->with('success', __('admin.settings.locale_updated'));
    }

    public function updateTimezone(Request $request): RedirectResponse
    {
        $availableTimezones = config('app.available_timezones', []);

        $validated = $request->validate([
            'timezone' => ['required', 'string', Rule::in($availableTimezones)],
        ]);

        $timezone = $validated['timezone'];

        Setting::updateValue('app.timezone', $timezone);

        config(['app.timezone' => $timezone]);
        $connection = config('database.default');
        $offset = CarbonTimeZone::create($timezone)->toOffsetName();
        config(["database.connections.{$connection}.timezone" => $offset]);
        date_default_timezone_set($timezone);

        $driver = config("database.connections.{$connection}.driver");

        if ($driver !== 'sqlite') {
            DB::purge($connection);
            DB::reconnect($connection);

            if ($driver === 'pgsql') {
                DB::statement("SET TIME ZONE '{$timezone}'");
            } elseif (in_array($driver, ['mysql', 'mariadb'])) {
                DB::statement("SET time_zone = '{$offset}'");
            }
        }

        return back()->with('success', __('admin.settings.timezone_updated'));
    }
}
