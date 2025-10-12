<?php

use App\Models\User;
use Carbon\CarbonInterface;
use Carbon\CarbonTimeZone;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

dataset('timezones', [
    ['UTC'],
    ['Asia/Tokyo'],
]);

it('stores timestamps in database respecting timezone', function (string $timezone) {
    $connection = config('database.default');
    $originalAppTimezone = config('app.timezone');
    $originalDbTimezone = config('database.connections.{$connection}.timezone');
    $originalPhpTimezone = date_default_timezone_get();
    $offset = CarbonTimeZone::create($timezone)->toOffsetName();

    try {
        Config::set('app.timezone', $timezone);
        Config::set('database.connections.{$connection}.timezone', $offset);
        date_default_timezone_set($timezone);

        DB::purge($connection);
        DB::reconnect($connection);

        DB::statement("SET TIME ZONE '{$timezone}'");

        $user = User::forceCreate([
            'name' => 'Timezone Tester',
            'email' => "timezone_{$timezone}@example.com",
            'password' => Hash::make('password'),
        ])->fresh();

        expect($user->created_at)->toBeInstanceOf(CarbonInterface::class)
            ->and(CarbonTimeZone::instance($user->created_at->getTimezone())->toOffsetName())
            ->toBe($offset);
    } finally {
        Config::set('app.timezone', $originalAppTimezone);
        Config::set('database.connections.{$connection}.timezone', $originalDbTimezone);
        date_default_timezone_set($originalPhpTimezone);

        DB::purge($connection);
        DB::reconnect($connection);

        DB::statement("SET TIME ZONE '{$originalAppTimezone}'");
    }
})->with('timezones');
