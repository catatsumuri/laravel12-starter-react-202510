<?php

use App\Http\Controllers\Admin\ApplicationSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::patch('notifications', [NotificationController::class, 'readAll'])
        ->name('notifications.read-all');
    Route::patch('notifications/{notification}', [NotificationController::class, 'read'])
        ->name('notifications.read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])
        ->name('notifications.destroy');
});

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('settings', [ApplicationSettingController::class, 'edit'])
            ->name('settings.edit');
        Route::put('settings', [ApplicationSettingController::class, 'update'])
            ->name('settings.update');

        Route::resource('users', UserController::class);
    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
