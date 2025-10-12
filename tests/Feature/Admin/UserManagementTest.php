<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

beforeEach(function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'user']);
});

function createAdmin(array $overrides = []): User
{
    $admin = User::factory()->create($overrides);
    $admin->assignRole('admin');

    return $admin;
}

function createMember(array $overrides = []): User
{
    $user = User::factory()->create($overrides);
    $user->assignRole('user');

    return $user;
}

it('allows admins to view the user index', function () {
    $admin = createAdmin();

    $this->actingAs($admin)->get('/admin/users')->assertOk();
});

it('forbids non-admins from viewing the user index', function () {
    $user = createMember();

    $this->actingAs($user)->get('/admin/users')->assertForbidden();
});

it('resets email verification timestamp when email is changed', function () {
    $admin = createAdmin();
    $user = createMember([
        'email' => 'member@example.com',
        'email_verified_at' => now(),
    ]);

    $payload = [
        'name' => 'Updated Member',
        'email' => 'updated-member@example.com',
        'password' => null,
        'password_confirmation' => null,
        'role' => 'user',
    ];

    $this->actingAs($admin)
        ->patch(route('admin.users.update', $user), $payload)
        ->assertRedirect(route('admin.users.edit', $user));

    $user->refresh();

    expect($user->email_verified_at)->toBeNull()
        ->and($user->email)->toBe('updated-member@example.com')
        ->and($user->hasRole('user'))->toBeTrue();
});

it('prevents admins from deleting themselves', function () {
    $admin = createAdmin();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertRedirect()
        ->assertSessionHas('error', __('You cannot delete your own account.'));

    expect($admin->fresh())->not->toBeNull()
        ->and($admin->deleted_at)->toBeNull();
});

it('soft deletes other users', function () {
    $admin = createAdmin();
    $user = createMember();

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success', __('User deleted successfully.'));

    $this->assertSoftDeleted('users', ['id' => $user->id]);
});
