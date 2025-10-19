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
            ->has('defaultAppearance')
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
    $currentTimezone = config('app.timezone');

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.name'))->toBe('Custom Admin Portal')
        ->and(config('app.name'))->toBe('Custom Admin Portal');
});

it('updates the allow registration flag', function () {
    Setting::updateValue('app.allow_registration', '0');
    config(['app.allow_registration' => false]);
    $currentTimezone = config('app.timezone');

    $admin = adminUser();

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.allow_registration'))->toBe('1')
        ->and(config('app.allow_registration'))->toBeTrue();
});

it('updates the timezone using the main settings form', function () {
    $admin = adminUser();
    $originalTimezone = config('app.timezone');
    $originalPhpTimezone = date_default_timezone_get();

    try {
        Setting::updateValue('app.timezone', $originalTimezone);

        $this->from(route('admin.settings.edit'))
            ->actingAs($admin)
            ->put(route('admin.settings.update'), [
                'app_name' => 'Custom Admin Portal',
                'allow_registration' => true,
                'allow_appearance_customization' => true,
                'allow_two_factor_authentication' => true,
                'allow_account_deletion' => true,
                'default_appearance' => 'light',
                'locale' => config('app.locale'),
                'timezone' => 'UTC',
            ])
            ->assertRedirect(route('admin.settings.edit'))
            ->assertSessionHas('success', __('admin.settings.application_updated'));

        expect(Setting::value('app.timezone'))->toBe('UTC')
            ->and(config('app.timezone'))->toBe('UTC')
            ->and(date_default_timezone_get())->toBe('UTC');
    } finally {
        config(['app.timezone' => $originalTimezone]);
        date_default_timezone_set($originalPhpTimezone);
    }
});

it('updates the appearance customization flag', function () {
    Setting::updateValue('app.allow_appearance_customization', '0');
    config(['app.allow_appearance_customization' => false]);
    Setting::updateValue('app.default_appearance', 'system');
    config(['app.default_appearance' => 'system']);
    $currentTimezone = config('app.timezone');

    $admin = adminUser();

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'default_appearance' => 'dark',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.allow_appearance_customization'))->toBe('1')
        ->and(config('app.allow_appearance_customization'))->toBeTrue()
        ->and(Setting::value('app.default_appearance'))->toBe('dark')
        ->and(config('app.default_appearance'))->toBe('dark');
});

it('updates the two factor authentication flag', function () {
    Setting::updateValue('app.allow_two_factor_authentication', '1');
    config(['app.allow_two_factor_authentication' => true]);
    $currentTimezone = config('app.timezone');

    $admin = adminUser();

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => false,
            'allow_account_deletion' => true,
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.allow_two_factor_authentication'))->toBe('0')
        ->and(config('app.allow_two_factor_authentication'))->toBeFalse();
});

it('updates the account deletion flag', function () {
    Setting::updateValue('app.allow_account_deletion', '1');
    config(['app.allow_account_deletion' => true]);
    $currentTimezone = config('app.timezone');

    $admin = adminUser();

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => false,
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.allow_account_deletion'))->toBe('0')
        ->and(config('app.allow_account_deletion'))->toBeFalse();
});

it('allows admins to view the debug mode settings page', function () {
    Setting::updateValue('app.debug', '1');
    config(['app.debug' => true]);
    $admin = adminUser();

    $this->actingAs($admin)
        ->withSession(['auth.password_confirmed_at' => now()->timestamp])
        ->get(route('admin.settings.debug.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/debug')
            ->where('debugEnabled', true)
        );
});

it('forbids non-admins from accessing the debug mode settings page', function () {
    $user = regularUser();

    $this->withoutMiddleware(ConfirmPassword::class)
        ->actingAs($user)
        ->get(route('admin.settings.debug.edit'))
        ->assertForbidden();
});

it('updates the debug mode preference', function () {
    Setting::updateValue('app.debug', '0');
    config(['app.debug' => false]);
    $admin = adminUser();

    $this->from(route('admin.settings.debug.edit'))
        ->actingAs($admin)
        ->withSession(['auth.password_confirmed_at' => now()->timestamp])
        ->put(route('admin.settings.debug.update'), [
            'debug_enabled' => '1',
        ])
        ->assertRedirect(route('admin.settings.debug.edit'))
        ->assertSessionHas('success', __('admin.settings.debug_mode_updated'));

    expect(Setting::value('app.debug'))->toBe('1')
        ->and(config('app.debug'))->toBeTrue();
});
