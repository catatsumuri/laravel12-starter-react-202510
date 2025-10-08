<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()
                ->intended(route('dashboard', absolute: false))
                ->with('success', __('Your email address is already verified.'));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()
            ->with('status', 'verification-link-sent')
            ->with('success', __('A new verification link has been sent to your email address.'));
    }
}
