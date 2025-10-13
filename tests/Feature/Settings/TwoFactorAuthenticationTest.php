<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('two factor settings page can be rendered', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['app.allow_appearance_customization' => true]);

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

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

    $user = User::factory()->create();

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $response = $this->actingAs($user)
        ->get(route('two-factor.show'));

    $response->assertRedirect(route('password.confirm'));
});

test('two factor settings page does not requires password confirmation when disabled', function () {
    if (! Features::canManageTwoFactorAuthentication()) {
        $this->markTestSkipped('Two-factor authentication is not enabled.');
    }

    config(['app.allow_appearance_customization' => true]);

    $user = User::factory()->create();

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => false,
    ]);

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

    config(['app.allow_appearance_customization' => true]);

    config(['fortify.features' => []]);
    config(['fortify.two_factor_authentication.enabled' => false]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('two-factor.show'))
        ->assertForbidden();
});

test('shared props contain two factor flag', function () {
    config(['fortify.features' => []]);
    config(['fortify.two_factor_authentication.enabled' => false]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('allowTwoFactorAuthentication', false)
        );
});

test('settings navigation omits two factor link when feature disabled', function () {
    config(['fortify.features' => []]);
    config(['fortify.two_factor_authentication.enabled' => false]);
    config(['app.allow_appearance_customization' => true]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settingsNavigation.twoFactor', false)
        );
});

test('settings navigation omits appearance link when feature disabled', function () {
    config(['fortify.features' => []]);
    config(['fortify.two_factor_authentication.enabled' => false]);
    config(['app.allow_appearance_customization' => false]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settingsNavigation.appearance', false)
        );
});

test('settings navigation hides two factor when appearance customization disabled', function () {
    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);
    config(['app.allow_appearance_customization' => false]);

    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('settingsNavigation.twoFactor', false)
        );
});

test('two factor settings page returns forbidden when appearance customization disabled', function () {
    $feature = Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);
    config(['fortify.features' => [$feature]]);
    config(['app.allow_appearance_customization' => false]);

    $user = User::factory()->withoutTwoFactor()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('two-factor.show'))
        ->assertForbidden();
});
