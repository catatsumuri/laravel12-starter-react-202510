<?php

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

test('admin users receive a system notification when a new user registers', function () {
    Notification::fake();

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    config(['app.allow_registration' => true]);

    $adminRole = Role::create(['name' => 'admin']);
    Role::create(['name' => 'user']);

    $admin = User::factory()->create();
    $admin->assignRole($adminRole);

    $response = $this->post('/register', [
        'name' => 'New User',
        'email' => 'new-user@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));

    $newUser = User::whereEmail('new-user@example.com')->first();
    expect($newUser)->not->toBeNull();

    Notification::assertSentTo(
        $admin,
        SystemNotification::class,
        function (SystemNotification $notification) use ($admin, $newUser): bool {
            $payload = $notification->toArray($admin);

            expect($payload['type'])->toBe('success');
            expect($payload['title'])->toBe(__('admin.notifications.new_user_registered.title'));
            expect($payload['message'])->toBe(__('admin.notifications.new_user_registered.message', ['name' => $newUser->name]));

            return true;
        }
    );

    Notification::assertNotSentTo($newUser, SystemNotification::class);
});
