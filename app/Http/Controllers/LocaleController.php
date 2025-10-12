<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    /**
     * Update the active application locale.
     */
    public function update(Request $request): RedirectResponse
    {
        $availableLocales = config('app.available_locales', []);

        $validated = $request->validate([
            'locale' => ['required', 'string', Rule::in($availableLocales)],
        ]);

        $request->session()->put('locale', $validated['locale']);

        return back();
    }
}

