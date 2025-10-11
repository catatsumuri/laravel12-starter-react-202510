<?php

namespace App\Listeners;

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Notification;

class SendAdminNewUserNotification
{
    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $newUser = $event->user;

        if (! $newUser instanceof User) {
            return;
        }

        $admins = User::query()
            ->whereKeyNot($newUser->getKey())
            ->whereHas('roles', fn ($query) => $query->where('name', 'admin'))
            ->get();

        if ($admins->isEmpty()) {
            return;
        }

        Notification::send(
            $admins,
            new SystemNotification([
                'type' => 'success',
                'title' => __('New user registered'),
                'message' => __(
                    ':name has created an account.',
                    ['name' => $newUser->name],
                ),
            ]),
        );
    }
}
