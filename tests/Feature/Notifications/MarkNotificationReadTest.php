<?php

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\patch;

it('marks a notification as read for the owning user', function () {
    $user = User::factory()->create();

    $notification = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->getKey(),
        'data' => [
            'type' => 'success',
            'title' => 'New user registered',
            'message' => 'Taro Tanaka has created an account',
        ],
        'read_at' => null,
    ]);

    actingAs($user);

    $response = patch(route('notifications.read', $notification));

    $response->assertRedirect();

    $notification->refresh();

    expect($notification->read_at)->not->toBeNull();
});

it('marks all notifications as read for the owning user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ownUnread = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->getKey(),
        'data' => [
            'type' => 'warning',
            'title' => 'Scheduled maintenance',
            'message' => 'Maintenance will run tomorrow from 2:00 to 4:00 AM',
        ],
        'read_at' => null,
    ]);

    $ownRead = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->getKey(),
        'data' => [
            'type' => 'success',
            'title' => 'Report generated',
            'message' => 'The monthly report export has completed successfully',
        ],
        'read_at' => now()->subHour(),
    ]);

    $othersUnread = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $otherUser->getKey(),
        'data' => [
            'type' => 'info',
            'title' => 'Feature update',
            'message' => 'A new analytics feature is now available on the dashboard',
        ],
        'read_at' => null,
    ]);

    actingAs($user);

    $response = patch(route('notifications.read-all'));

    $response->assertRedirect();

    $ownUnread->refresh();
    $ownRead->refresh();
    $othersUnread->refresh();

    expect($ownUnread->read_at)->not->toBeNull()
        ->and($ownRead->read_at)->not->toBeNull()
        ->and($othersUnread->read_at)->toBeNull();
});

it('deletes a notification for the owning user', function () {
    $user = User::factory()->create();

    $notification = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->getKey(),
        'data' => [
            'type' => 'error',
            'title' => 'Sync error detected',
            'message' => 'An error occurred while syncing the latest data',
        ],
        'read_at' => null,
    ]);

    actingAs($user);

    $response = delete(route('notifications.destroy', $notification));

    $response->assertRedirect();

    expect(DatabaseNotification::find($notification->id))->toBeNull();
});

it('forbids marking notifications that belong to another user', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $notification = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $owner->getKey(),
        'data' => [
            'type' => 'info',
            'title' => 'Maintenance reminder',
            'message' => 'Scheduled maintenance begins at 2:00 AM.',
        ],
        'read_at' => null,
    ]);

    actingAs($intruder);

    $response = patch(route('notifications.read', $notification));

    $response->assertForbidden();

    $notification->refresh();

    expect($notification->read_at)->toBeNull();
});

it('forbids deleting notifications that belong to another user', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $notification = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\SystemNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $owner->getKey(),
        'data' => [
            'type' => 'warning',
            'title' => 'System update',
            'message' => 'System updates are scheduled for later today.',
        ],
        'read_at' => null,
    ]);

    actingAs($intruder);

    $response = delete(route('notifications.destroy', $notification));

    $response->assertForbidden();

    expect(DatabaseNotification::find($notification->id))->not->toBeNull();
});
