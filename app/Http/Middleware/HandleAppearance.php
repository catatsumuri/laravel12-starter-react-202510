<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowCustomization = config('app.allow_appearance_customization');

        $defaultAppearance = config('app.default_appearance', 'light');

        if (! $allowCustomization) {
            Cookie::queue(Cookie::forget('appearance'));
            View::share('appearance', $defaultAppearance);

            return $next($request);
        }

        View::share('appearance', $request->cookie('appearance') ?? $defaultAppearance);

        return $next($request);
    }
}
