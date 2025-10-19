<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class DebugModeController extends Controller implements HasMiddleware
{
    /**
     * @return array<int, \Illuminate\Routing\Controllers\Middleware>
     */
    public static function middleware(): array
    {
        return [
            new Middleware('password.confirm', only: ['edit', 'update']),
        ];
    }

    public function edit(): Response
    {
        return Inertia::render('admin/settings/debug', [
            'debugEnabled' => (bool) config('app.debug'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'debug_enabled' => ['required', 'boolean'],
        ]);

        $debugEnabled = (bool) $validated['debug_enabled'];

        Setting::updateValue('app.debug', $debugEnabled ? '1' : '0');
        config(['app.debug' => $debugEnabled]);

        return redirect()
            ->route('admin.settings.debug.edit')
            ->with('success', __('admin.settings.debug_mode_updated'));
    }
}
