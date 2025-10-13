<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('two factor settings page can be rendered', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['app.allow_appearance_customization' => true]);
    config(['app.allow_two_factor_authentication' => true]);

    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);

    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('two-factor.show'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/two-factor')
            ->where('twoFactorEnabled', false)
        );
});

test('two factor settings page requires password confirmation when enabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['app.allow_appearance_customization' => true]);
    config(['app.allow_two_factor_authentication' => true]);

    $user = User::factory()->create();

    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);

    $response = $this->actingAs($user)
        ->get(route('two-factor.show'));

    $response->assertRedirect(route('password.confirm'));
});

test('two factor settings page does not requires password confirmation when disabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['app.allow_appearance_customization' => true]);
    config(['app.allow_two_factor_authentication' => true]);

    $user = User::factory()->create();

    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => false,
    ]);
    config(['fortify.features' => [$feature]]);

    $this->actingAs($user)
        ->get(route('two-factor.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/two-factor')
        );
});

test('two factor settings page returns forbidden response when two factor is disabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['app.allow_two_factor_authentication' => false]);

    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('two-factor.show'))
        ->assertForbidden();
});

test('shared props reflect disabled two factor flag', function () {
    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);
    config(['app.allow_two_factor_authentication' => false]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('allowTwoFactorAuthentication', false)
        );
});

test('settings navigation omits two factor link when application disables it', function () {
    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);
    config(['app.allow_two_factor_authentication' => false]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settingsNavigation.twoFactor', false)
        );
});

test('settings navigation omits appearance link when appearance feature disabled', function () {
    config(['app.allow_appearance_customization' => false]);
    config(['app.allow_two_factor_authentication' => true]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settingsNavigation.appearance', false)
        );
});

test('settings navigation shows two factor link even when appearance customization disabled', function () {
    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);
    config(['app.allow_appearance_customization' => false]);
    config(['app.allow_two_factor_authentication' => true]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settingsNavigation.twoFactor', true)
        );
});

test('two factor settings page accessible when appearance customization disabled', function () {
    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);
    config(['app.allow_appearance_customization' => false]);
    config(['app.allow_two_factor_authentication' => true]);

    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('two-factor.show'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/two-factor')
        );
});
