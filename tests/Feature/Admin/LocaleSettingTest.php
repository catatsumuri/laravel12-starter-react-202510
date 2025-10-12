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

it('allows admins to update the locale', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->from(route('admin.settings.edit'))
        ->post(route('admin.settings.locale'), ['locale' => 'en'])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHasNoErrors();

    expect(session('locale'))->toBe('en');
});

it('prevents non-admin users from updating the locale', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->post(route('admin.settings.locale'), ['locale' => 'en'])
        ->assertForbidden();
});
