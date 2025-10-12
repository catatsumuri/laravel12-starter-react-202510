<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates the session locale when a valid locale is provided', function () {
    $this->from('/')
        ->post(route('locale.update'), ['locale' => 'en'])
        ->assertRedirect('/');

    expect(session('locale'))->toBe('en');
});

it('rejects invalid locales', function () {
    $this->from('/')
        ->post(route('locale.update'), ['locale' => 'fr'])
        ->assertRedirect('/')
        ->assertSessionHasErrors('locale');

    expect(session('locale'))->not->toBe('fr');
});

