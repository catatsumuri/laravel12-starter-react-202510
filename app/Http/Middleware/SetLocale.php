<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $availableLocales = config('app.available_locales', []);
        $fallback = config('app.locale');
        $locale = $request->session()->get('locale', $fallback);

        if (! in_array($locale, $availableLocales, true)) {
            $locale = $fallback;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
