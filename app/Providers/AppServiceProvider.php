<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        if ($appName = Setting::value('app.name')) {
            config(['app.name' => $appName]);
        }

        if ($timezone = Setting::value('app.timezone')) {
            config(['app.timezone' => $timezone]);
            date_default_timezone_set($timezone);
        }

        $this->syncBooleanSetting('app.allow_registration', 'app.allow_registration');
        $this->syncBooleanSetting('app.allow_account_deletion', 'app.allow_account_deletion');
        $this->syncDebugMode();
        $this->syncAppearanceCustomization();
        $this->syncTwoFactorAuthentication();
        $this->syncAppearanceSetting();
        $this->syncLocale();
        $this->syncAwsSettings();
        $this->syncMailSettings();
        $this->syncLogSettings();
    }

    protected function syncBooleanSetting(string $settingKey, string $configKey): void
    {
        $value = Setting::value($settingKey);

        if (is_null($value)) {
            return;
        }

        config([$configKey => filter_var($value, FILTER_VALIDATE_BOOL)]);
    }

    protected function syncAppearanceSetting(): void
    {
        $value = Setting::value('app.default_appearance');

        if (is_null($value)) {
            return;
        }

        $allowed = ['light', 'dark', 'system'];

        if (! in_array($value, $allowed, true)) {
            return;
        }

        config(['app.default_appearance' => $value]);
    }

    protected function syncAppearanceCustomization(): void
    {
        $stored = Setting::value('app.allow_appearance_customization');

        if (! is_null($stored)) {
            $value = filter_var($stored, FILTER_VALIDATE_BOOL);
        } else {
            $value = (bool) env('APP_ALLOW_APPEARANCE_CUSTOMIZATION', true);
        }

        config(['app.allow_appearance_customization' => $value]);
    }

    protected function syncTwoFactorAuthentication(): void
    {
        $stored = Setting::value('app.allow_two_factor_authentication');

        if (! is_null($stored)) {
            $value = filter_var($stored, FILTER_VALIDATE_BOOL);
        } else {
            $value = (bool) env('APP_ALLOW_TWO_FACTOR_AUTHENTICATION', true);
        }

        config(['app.allow_two_factor_authentication' => $value]);
    }

    protected function syncLocale(): void
    {
        $locale = Setting::value('app.locale');

        if (! is_null($locale) && in_array($locale, config('app.available_locales', []), true)) {
            config(['app.locale' => $locale]);
            app()->setLocale($locale);
        }
    }

    protected function syncDebugMode(): void
    {
        $stored = Setting::value('app.debug');

        if (is_null($stored)) {
            return;
        }

        config(['app.debug' => filter_var($stored, FILTER_VALIDATE_BOOL)]);
    }

    protected function syncAwsSettings(): void
    {
        $awsKey = Setting::value('aws.access_key_id');
        if (! is_null($awsKey)) {
            config(['filesystems.disks.s3.key' => $awsKey]);
        }

        $awsSecret = Setting::value('aws.secret_access_key');
        if (! is_null($awsSecret)) {
            config(['filesystems.disks.s3.secret' => $awsSecret]);
        }

        $awsRegion = Setting::value('aws.default_region');
        if (! is_null($awsRegion)) {
            config(['filesystems.disks.s3.region' => $awsRegion]);
        }

        $awsBucket = Setting::value('aws.bucket');
        if (! is_null($awsBucket)) {
            config(['filesystems.disks.s3.bucket' => $awsBucket]);
        }

        $usePathStyle = Setting::value('aws.use_path_style_endpoint');
        if (! is_null($usePathStyle)) {
            config([
                'filesystems.disks.s3.use_path_style_endpoint' => filter_var(
                    $usePathStyle,
                    FILTER_VALIDATE_BOOL,
                ),
            ]);
        }
    }

    protected function syncMailSettings(): void
    {
        if ($mailer = Setting::value('mail.mailer')) {
            config(['mail.default' => $mailer]);
        }

        if (Setting::value('mail.scheme') !== null) {
            config(['mail.mailers.smtp.scheme' => Setting::value('mail.scheme') ?: null]);
        }

        if ($host = Setting::value('mail.host')) {
            config(['mail.mailers.smtp.host' => $host]);
        }

        if ($port = Setting::value('mail.port')) {
            config(['mail.mailers.smtp.port' => (int) $port]);
        }

        if (Setting::value('mail.username') !== null) {
            $username = Setting::value('mail.username');
            config(['mail.mailers.smtp.username' => $username !== '' ? $username : null]);
        }

        if ($password = Setting::value('mail.password')) {
            config(['mail.mailers.smtp.password' => $password]);
        }

        if ($fromAddress = Setting::value('mail.from_address')) {
            config(['mail.from.address' => $fromAddress]);
        }

        if ($fromName = Setting::value('mail.from_name')) {
            config(['mail.from.name' => $fromName]);
        }
    }

    protected function syncLogSettings(): void
    {
        if ($channel = Setting::value('log.channel')) {
            config(['logging.default' => $channel]);
        }

        if ($level = Setting::value('log.level')) {
            $defaultChannel = config('logging.default');

            if ($defaultChannel && is_array(config('logging.channels.'.$defaultChannel))) {
                config(['logging.channels.'.$defaultChannel.'.level' => $level]);
            }

            foreach (['stack', 'single', 'daily'] as $fallbackChannel) {
                if (is_array(config('logging.channels.'.$fallbackChannel))) {
                    config(['logging.channels.'.$fallbackChannel.'.level' => $level]);
                }
            }
        }

        if ($stackChannels = Setting::value('log.stack_channels')) {
            $channels = array_values(array_filter(array_map('trim', explode(',', $stackChannels))));

            if (! empty($channels)) {
                config(['logging.channels.stack.channels' => $channels]);
            }
        }

        if ($slackUrl = Setting::value('log.slack_webhook_url')) {
            config(['logging.channels.slack.url' => $slackUrl]);
        }

        if (Setting::value('log.slack_username') !== null) {
            $username = Setting::value('log.slack_username');
            config(['logging.channels.slack.username' => $username !== '' ? $username : null]);
        }

        if (Setting::value('log.slack_emoji') !== null) {
            $emoji = Setting::value('log.slack_emoji');
            config(['logging.channels.slack.emoji' => $emoji !== '' ? $emoji : null]);
        }
    }
}
