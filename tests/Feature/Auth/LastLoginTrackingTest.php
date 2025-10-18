<?php

use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

it('updates the last login timestamp when a login event is handled', function () {
    $now = Carbon::parse('2025-10-15 12:00:00', config('app.timezone'));
    Carbon::setTestNow($now);

    try {
        $user = User::factory()->create([
            'last_login_at' => null,
        ]);

        expect($user->last_login_at)->toBeNull();

        event(new Login('web', $user, false));

        $user->refresh();

        expect($user->last_login_at)->not->toBeNull()
            ->and($user->last_login_at?->equalTo($now))->toBeTrue();
    } finally {
        Carbon::setTestNow();
    }
});
