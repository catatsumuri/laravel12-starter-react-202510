<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

beforeEach(function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'user']);
});

function adminUser(array $overrides = []): User
{
    $admin = User::factory()->create($overrides);
    $admin->assignRole('admin');

    return $admin;
}

function regularUser(array $overrides = []): User
{
    $user = User::factory()->create($overrides);
    $user->assignRole('user');

    return $user;
}

it('allows admins to view the settings page', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/index')
            ->has('appName')
        );
});

it('forbids non-admins from accessing the settings page', function () {
    $user = regularUser();

    $this->actingAs($user)
        ->get(route('admin.settings.edit'))
        ->assertForbidden();
});

it('updates the application name', function () {
    $admin = adminUser();
    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', 'Application name updated.');

    expect(Setting::value('app.name'))->toBe('Custom Admin Portal')
        ->and(config('app.name'))->toBe('Custom Admin Portal');
});
