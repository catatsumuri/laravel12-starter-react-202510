<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    /**
     * Mark all notifications as read.
     */
    public function readAll(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->unreadNotifications()
            ->where('notifiable_type', $user::class)
            ->where('notifiable_id', $user->getKey())
            ->update(['read_at' => now()]);

        return back();
    }

    /**
     * Mark a single notification as read.
     */
    public function read(
        Request $request,
        DatabaseNotification $notification,
    ): RedirectResponse {
        $user = $request->user();

        if (
            $notification->notifiable_type !== $user::class
            || (int) $notification->notifiable_id !== (int) $user->getKey()
        ) {
            abort(403);
        }

        if (is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        return back();
    }

    /**
     * Delete a single notification.
     */
    public function destroy(
        Request $request,
        DatabaseNotification $notification,
    ): RedirectResponse {
        $user = $request->user();

        if (
            $notification->notifiable_type !== $user::class
            || (int) $notification->notifiable_id !== (int) $user->getKey()
        ) {
            abort(403);
        }

        $notification->delete();

        return back();
    }
}
