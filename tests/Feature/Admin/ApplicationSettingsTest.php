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
            'app_url' => 'https://app.example.com',
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'log_channel' => 'stack',
            'log_level' => 'debug',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.name'))->toBe('Custom Admin Portal')
        ->and(config('app.name'))->toBe('Custom Admin Portal');
    expect(Setting::value('app.url'))->toBe('https://app.example.com')
        ->and(config('app.url'))->toBe('https://app.example.com');
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
            'app_url' => null,
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'log_channel' => 'stack',
            'log_level' => 'debug',
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
                'app_url' => null,
                'allow_registration' => true,
                'allow_appearance_customization' => true,
                'allow_two_factor_authentication' => true,
                'allow_account_deletion' => true,
                'log_channel' => 'stack',
                'log_level' => 'debug',
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
            'app_url' => null,
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'log_channel' => 'stack',
            'log_level' => 'debug',
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
            'app_url' => null,
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => false,
            'allow_account_deletion' => true,
            'log_channel' => 'stack',
            'log_level' => 'debug',
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
            'app_url' => null,
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => false,
            'aws_access_key_id' => null,
            'aws_secret_access_key' => null,
            'aws_default_region' => null,
            'aws_bucket' => null,
            'aws_use_path_style_endpoint' => false,
            'log_channel' => 'stack',
            'log_level' => 'debug',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('app.allow_account_deletion'))->toBe('0')
        ->and(config('app.allow_account_deletion'))->toBeFalse();
});

it('updates log settings', function () {
    Setting::updateValue('log.channel', 'stack');
    Setting::updateValue('log.level', 'debug');
    config(['logging.default' => 'stack']);
    config(['logging.channels.stack.level' => 'debug']);

    $admin = adminUser();
    $currentTimezone = config('app.timezone');

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'app_url' => null,
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'log_channel' => 'daily',
            'log_level' => 'error',
            'log_stack_channels' => 'single,slack',
            'log_slack_webhook_url' => 'https://hooks.slack.com/services/TOKEN',
            'log_slack_username' => 'LoggerBot',
            'log_slack_emoji' => ':bell:',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('log.channel'))->toBe('daily')
        ->and(Setting::value('log.level'))->toBe('error')
        ->and(Setting::value('log.stack_channels'))->toBe('single,slack')
        ->and(Setting::value('log.slack_webhook_url'))->toBe('https://hooks.slack.com/services/TOKEN')
        ->and(Setting::value('log.slack_username'))->toBe('LoggerBot')
        ->and(Setting::value('log.slack_emoji'))->toBe(':bell:');

    expect(config('logging.default'))->toBe('daily')
        ->and(config('logging.channels.daily.level'))->toBe('error')
        ->and(config('logging.channels.stack.level'))->toBe('error')
        ->and(config('logging.channels.stack.channels'))->toBe(['single', 'slack'])
        ->and(config('logging.channels.slack.url'))->toBe('https://hooks.slack.com/services/TOKEN')
        ->and(config('logging.channels.slack.username'))->toBe('LoggerBot')
        ->and(config('logging.channels.slack.emoji'))->toBe(':bell:');
});

it('updates aws storage settings', function () {
    $originalSecret = 'initial-secret';
    Setting::updateValue('aws.secret_access_key', $originalSecret);
    config(['filesystems.disks.s3.secret' => $originalSecret]);

    $admin = adminUser();
    $currentTimezone = config('app.timezone');

    $this->from(route('admin.settings.edit'))
        ->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'app_name' => 'Custom Admin Portal',
            'app_url' => null,
            'allow_registration' => true,
            'allow_appearance_customization' => true,
            'allow_two_factor_authentication' => true,
            'allow_account_deletion' => true,
            'aws_access_key_id' => 'NEWACCESSKEY',
            'aws_secret_access_key' => 'NEWSECRET',
            'aws_default_region' => 'ap-northeast-1',
            'aws_bucket' => 'my-app-bucket',
            'aws_use_path_style_endpoint' => true,
            'log_channel' => 'stack',
            'log_level' => 'debug',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('aws.access_key_id'))->toBe('NEWACCESSKEY')
        ->and(Setting::value('aws.secret_access_key'))->toBe('NEWSECRET')
        ->and(Setting::value('aws.default_region'))->toBe('ap-northeast-1')
        ->and(Setting::value('aws.bucket'))->toBe('my-app-bucket')
        ->and(Setting::value('aws.use_path_style_endpoint'))->toBe('1');

    expect(config('filesystems.disks.s3.key'))->toBe('NEWACCESSKEY')
        ->and(config('filesystems.disks.s3.secret'))->toBe('NEWSECRET')
        ->and(config('filesystems.disks.s3.region'))->toBe('ap-northeast-1')
        ->and(config('filesystems.disks.s3.bucket'))->toBe('my-app-bucket')
        ->and(config('filesystems.disks.s3.use_path_style_endpoint'))->toBeTrue();
});

it('keeps aws secret when placeholder is submitted', function () {
    Setting::updateValue('aws.secret_access_key', 'existing-secret');
    config(['filesystems.disks.s3.secret' => 'existing-secret']);
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
            'aws_access_key_id' => 'ACCESS',
            'aws_secret_access_key' => '********',
            'aws_default_region' => 'us-east-1',
            'aws_bucket' => 'bucket-name',
            'aws_use_path_style_endpoint' => false,
            'log_channel' => 'stack',
            'log_level' => 'debug',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('aws.secret_access_key'))->toBe('existing-secret')
        ->and(config('filesystems.disks.s3.secret'))->toBe('existing-secret');
});

it('updates mail settings', function () {
    Setting::updateValue('mail.password', 'old-secret');
    config(['mail.mailers.smtp.password' => 'old-secret']);

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
            'aws_access_key_id' => null,
            'aws_secret_access_key' => null,
            'aws_default_region' => null,
            'aws_bucket' => null,
            'aws_use_path_style_endpoint' => false,
            'log_channel' => 'stack',
            'log_level' => 'debug',
            'mail_mailer' => 'smtp',
            'mail_scheme' => 'tls',
            'mail_host' => 'smtp.example.com',
            'mail_port' => 587,
            'mail_username' => 'user',
            'mail_password' => 'new-secret',
            'mail_from_address' => 'hello@example.com',
            'mail_from_name' => 'Example App',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('mail.mailer'))->toBe('smtp')
        ->and(Setting::value('mail.scheme'))->toBe('tls')
        ->and(Setting::value('mail.host'))->toBe('smtp.example.com')
        ->and(Setting::value('mail.port'))->toBe('587')
        ->and(Setting::value('mail.username'))->toBe('user')
        ->and(Setting::value('mail.password'))->toBe('new-secret')
        ->and(Setting::value('mail.from_address'))->toBe('hello@example.com')
        ->and(Setting::value('mail.from_name'))->toBe('Example App');

    expect(config('mail.default'))->toBe('smtp')
        ->and(config('mail.mailers.smtp.scheme'))->toBe('tls')
        ->and(config('mail.mailers.smtp.host'))->toBe('smtp.example.com')
        ->and(config('mail.mailers.smtp.port'))->toBe(587)
        ->and(config('mail.mailers.smtp.username'))->toBe('user')
        ->and(config('mail.mailers.smtp.password'))->toBe('new-secret')
        ->and(config('mail.from.address'))->toBe('hello@example.com')
        ->and(config('mail.from.name'))->toBe('Example App');
});

it('keeps mail password when placeholder is submitted', function () {
    Setting::updateValue('mail.password', 'existing-mail-secret');
    config(['mail.mailers.smtp.password' => 'existing-mail-secret']);

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
            'aws_access_key_id' => null,
            'aws_secret_access_key' => null,
            'aws_default_region' => null,
            'aws_bucket' => null,
            'aws_use_path_style_endpoint' => false,
            'log_channel' => 'stack',
            'log_level' => 'debug',
            'mail_mailer' => 'log',
            'mail_scheme' => null,
            'mail_host' => '127.0.0.1',
            'mail_port' => 2525,
            'mail_username' => null,
            'mail_password' => '********',
            'mail_from_address' => 'hello@example.com',
            'mail_from_name' => 'Example',
            'default_appearance' => 'light',
            'locale' => config('app.locale'),
            'timezone' => $currentTimezone,
        ])
        ->assertRedirect(route('admin.settings.edit'))
        ->assertSessionHas('success', __('admin.settings.application_updated'));

    expect(Setting::value('mail.password'))->toBe('existing-mail-secret')
        ->and(config('mail.mailers.smtp.password'))->toBe('existing-mail-secret');
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
