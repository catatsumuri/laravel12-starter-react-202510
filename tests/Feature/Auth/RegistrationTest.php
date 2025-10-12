<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    config(['app.allow_registration' => true]);

    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    config(['app.allow_registration' => true]);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('registration is not available when disabled', function () {
    config(['app.allow_registration' => false]);

    $this->get(route('register'))->assertNotFound();

    $this->post(route('register.store'), [
        'name' => 'Disabled User',
        'email' => 'disabled@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();

    expect(User::count())->toBe(0);
    $this->assertGuest();
});
