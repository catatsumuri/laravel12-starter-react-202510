<?php

use Inertia\Testing\AssertableInertia;

test('welcome page respects registration toggle', function () {
    config(['app.allow_registration' => false]);

    $this->get(route('home'))
        ->assertStatus(200)
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('allowRegistration', false)
        );

    config(['app.allow_registration' => true]);

    $this->get(route('home'))
        ->assertStatus(200)
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('allowRegistration', true)
        );
});
