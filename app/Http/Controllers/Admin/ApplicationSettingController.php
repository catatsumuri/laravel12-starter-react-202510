<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Carbon\CarbonTimeZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings/index', [
            'appName' => Setting::value('app.name', config('app.name')),
            'appUrl' => Setting::value('app.url', config('app.url')),
            'allowRegistration' => config('app.allow_registration'),
            'allowAppearanceCustomization' => config('app.allow_appearance_customization'),
            'allowTwoFactorAuthentication' => config('app.allow_two_factor_authentication'),
            'allowAccountDeletion' => config('app.allow_account_deletion'),
            'defaultAppearance' => config('app.default_appearance', 'light'),
            'appDebug' => config('app.debug'),
            'awsAccessKeyId' => Setting::value('aws.access_key_id', config('filesystems.disks.s3.key')),
            'awsSecretAccessKey' => Setting::value('aws.secret_access_key')
                ? '********'
                : '',
            'awsDefaultRegion' => Setting::value('aws.default_region', config('filesystems.disks.s3.region', 'us-east-1')),
            'awsBucket' => Setting::value('aws.bucket', config('filesystems.disks.s3.bucket')),
            'awsUsePathStyleEndpoint' => filter_var(
                Setting::value('aws.use_path_style_endpoint'),
                FILTER_VALIDATE_BOOL,
            ) ?? (bool) (config('filesystems.disks.s3.use_path_style_endpoint') ?? false),
            'logChannel' => Setting::value('log.channel', config('logging.default', 'stack')),
            'logLevel' => Setting::value('log.level', config('logging.channels.'.config('logging.default', 'stack').'.level', 'debug')),
            'logStackChannels' => Setting::value('log.stack_channels', implode(',', config('logging.channels.stack.channels', ['single']))),
            'logSlackWebhookUrl' => Setting::value('log.slack_webhook_url', config('logging.channels.slack.url')),
            'logSlackUsername' => Setting::value('log.slack_username', config('logging.channels.slack.username')),
            'logSlackEmoji' => Setting::value('log.slack_emoji', config('logging.channels.slack.emoji')),
            'mailMailer' => Setting::value('mail.mailer', config('mail.default', 'log')),
            'mailScheme' => Setting::value('mail.scheme', config('mail.mailers.smtp.scheme')),
            'mailHost' => Setting::value('mail.host', config('mail.mailers.smtp.host', '127.0.0.1')),
            'mailPort' => Setting::value('mail.port', (string) config('mail.mailers.smtp.port', 2525)),
            'mailUsername' => Setting::value('mail.username', config('mail.mailers.smtp.username')),
            'mailPassword' => Setting::value('mail.password')
                ? '********'
                : '',
            'mailFromAddress' => Setting::value('mail.from_address', config('mail.from.address', 'hello@example.com')),
            'mailFromName' => Setting::value('mail.from_name', config('mail.from.name', config('app.name'))),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $availableTimezones = config('app.available_timezones', []);
        $availableLocales = config('app.available_locales', []);

        $validated = $request->validate([
            'app_name' => ['required', 'string', 'max:255'],
            'app_url' => ['nullable', 'url'],
            'allow_registration' => ['nullable', 'boolean'],
            'allow_appearance_customization' => ['nullable', 'boolean'],
            'allow_two_factor_authentication' => ['nullable', 'boolean'],
            'allow_account_deletion' => ['nullable', 'boolean'],
            'aws_access_key_id' => ['nullable', 'string', 'max:255'],
            'aws_secret_access_key' => ['nullable', 'string', 'max:255'],
            'aws_default_region' => ['nullable', 'string', 'max:255'],
            'aws_bucket' => ['nullable', 'string', 'max:255'],
            'aws_use_path_style_endpoint' => ['nullable', 'boolean'],
            'log_channel' => ['nullable', 'string', 'max:255'],
            'log_level' => ['nullable', 'string', 'max:255'],
            'log_stack_channels' => ['nullable', 'string'],
            'log_slack_webhook_url' => ['nullable', 'url'],
            'log_slack_username' => ['nullable', 'string', 'max:255'],
            'log_slack_emoji' => ['nullable', 'string', 'max:50'],
            'mail_mailer' => ['nullable', 'string', 'max:255'],
            'mail_scheme' => ['nullable', 'string', 'max:255'],
            'mail_host' => ['nullable', 'string', 'max:255'],
            'mail_port' => ['nullable', 'integer'],
            'mail_username' => ['nullable', 'string', 'max:255'],
            'mail_password' => ['nullable', 'string', 'max:255'],
            'mail_from_address' => ['nullable', 'email', 'max:255'],
            'mail_from_name' => ['nullable', 'string', 'max:255'],
            'locale' => ['required', 'string', Rule::in($availableLocales)],
            'default_appearance' => ['required', 'string', Rule::in(['light', 'dark', 'system'])],
            'timezone' => [
                'nullable',
                'string',
                Rule::requiredIf(! empty($availableTimezones)),
                Rule::in($availableTimezones),
            ],
        ]);

        $appName = $validated['app_name'];
        $allowRegistration = $request->boolean('allow_registration');
        $appUrl = $validated['app_url'] ?? null;
        $allowAppearanceCustomization = $request->boolean('allow_appearance_customization');
        $allowTwoFactorAuthentication = $request->boolean('allow_two_factor_authentication');
        $allowAccountDeletion = $request->boolean('allow_account_deletion');
        $awsAccessKeyId = $validated['aws_access_key_id'] ?? null;
        $awsSecretAccessKey = $validated['aws_secret_access_key'] ?? null;
        $awsDefaultRegion = $validated['aws_default_region'] ?? null;
        $awsBucket = $validated['aws_bucket'] ?? null;
        $awsUsePathStyleEndpoint = $request->boolean('aws_use_path_style_endpoint');
        $logChannel = $validated['log_channel'] ?? null;
        $logLevel = $validated['log_level'] ?? null;
        $logStackChannelsRaw = $validated['log_stack_channels'] ?? null;
        $logSlackWebhookUrl = $validated['log_slack_webhook_url'] ?? null;
        $logSlackUsername = $validated['log_slack_username'] ?? null;
        $logSlackEmoji = $validated['log_slack_emoji'] ?? null;
        $mailMailer = $validated['mail_mailer'] ?? null;
        $mailScheme = $validated['mail_scheme'] ?? null;
        $mailHost = $validated['mail_host'] ?? null;
        $mailPort = $validated['mail_port'] ?? null;
        $mailUsername = $validated['mail_username'] ?? null;
        $mailPassword = $validated['mail_password'] ?? null;
        $mailFromAddress = $validated['mail_from_address'] ?? null;
        $mailFromName = $validated['mail_from_name'] ?? null;

        if ($awsSecretAccessKey === '********') {
            $awsSecretAccessKey = null;
        }
        if ($mailPassword === '********') {
            $mailPassword = null;
        }
        Setting::updateValue('app.allow_appearance_customization', $allowAppearanceCustomization ? '1' : '0');
        Setting::updateValue('app.allow_two_factor_authentication', $allowTwoFactorAuthentication ? '1' : '0');
        Setting::updateValue('app.allow_account_deletion', $allowAccountDeletion ? '1' : '0');
        $defaultAppearance = $validated['default_appearance'];
        $locale = $validated['locale'];
        $timezone = $validated['timezone'] ?? null;

        Setting::updateValue('app.name', $appName);
        Setting::updateValue('app.allow_registration', $allowRegistration ? '1' : '0');
        Setting::updateValue('app.default_appearance', $defaultAppearance);
        if (! is_null($appUrl)) {
            Setting::updateValue('app.url', $appUrl);
            config(['app.url' => $appUrl]);
        }

        config(['app.name' => $appName]);
        config(['app.allow_registration' => $allowRegistration]);
        config(['app.allow_appearance_customization' => $allowAppearanceCustomization]);
        config(['app.allow_two_factor_authentication' => $allowTwoFactorAuthentication]);
        config(['app.allow_account_deletion' => $allowAccountDeletion]);
        config(['app.url' => $appUrl ?? config('app.url')]);
        if (! is_null($awsAccessKeyId)) {
            Setting::updateValue('aws.access_key_id', $awsAccessKeyId);
            config(['filesystems.disks.s3.key' => $awsAccessKeyId]);
        }

        if (! is_null($awsSecretAccessKey) && $awsSecretAccessKey !== '') {
            Setting::updateValue('aws.secret_access_key', $awsSecretAccessKey);
            config(['filesystems.disks.s3.secret' => $awsSecretAccessKey]);
        }

        if (! is_null($awsDefaultRegion)) {
            Setting::updateValue('aws.default_region', $awsDefaultRegion);
            config(['filesystems.disks.s3.region' => $awsDefaultRegion]);
        }

        if (! is_null($awsBucket)) {
            Setting::updateValue('aws.bucket', $awsBucket);
            config(['filesystems.disks.s3.bucket' => $awsBucket]);
        }

        Setting::updateValue('aws.use_path_style_endpoint', $awsUsePathStyleEndpoint ? '1' : '0');
        config(['filesystems.disks.s3.use_path_style_endpoint' => $awsUsePathStyleEndpoint]);

        if (! is_null($logChannel)) {
            Setting::updateValue('log.channel', $logChannel);
            config(['logging.default' => $logChannel]);
        }

        if (! is_null($logLevel)) {
            Setting::updateValue('log.level', $logLevel);
            $targetChannel = $logChannel ?? config('logging.default');
            if ($targetChannel && is_array(config('logging.channels.'.$targetChannel))) {
                config(['logging.channels.'.$targetChannel.'.level' => $logLevel]);
            }

            foreach (['stack', 'single', 'daily'] as $channel) {
                if (is_array(config('logging.channels.'.$channel))) {
                    config(['logging.channels.'.$channel.'.level' => $logLevel]);
                }
            }
        }

        if (! is_null($logStackChannelsRaw)) {
            $stackChannels = array_values(array_filter(array_map(static fn ($value) => trim($value), explode(',', $logStackChannelsRaw))));

            Setting::updateValue('log.stack_channels', implode(',', $stackChannels));

            if (! empty($stackChannels)) {
                config(['logging.channels.stack.channels' => $stackChannels]);
            }
        }

        if (! is_null($logSlackWebhookUrl)) {
            Setting::updateValue('log.slack_webhook_url', $logSlackWebhookUrl);
            config(['logging.channels.slack.url' => $logSlackWebhookUrl]);
        }

        if (! is_null($logSlackUsername)) {
            Setting::updateValue('log.slack_username', $logSlackUsername);
            config(['logging.channels.slack.username' => $logSlackUsername !== '' ? $logSlackUsername : null]);
        }

        if (! is_null($logSlackEmoji)) {
            Setting::updateValue('log.slack_emoji', $logSlackEmoji);
            config(['logging.channels.slack.emoji' => $logSlackEmoji !== '' ? $logSlackEmoji : null]);
        }

        if (! is_null($mailMailer)) {
            Setting::updateValue('mail.mailer', $mailMailer);
            config(['mail.default' => $mailMailer]);
        }

        if (! is_null($mailScheme)) {
            Setting::updateValue('mail.scheme', $mailScheme);
            config(['mail.mailers.smtp.scheme' => $mailScheme !== '' ? $mailScheme : null]);
        }

        if (! is_null($mailHost)) {
            Setting::updateValue('mail.host', $mailHost);
            config(['mail.mailers.smtp.host' => $mailHost]);
        }

        if (! is_null($mailPort)) {
            Setting::updateValue('mail.port', (string) $mailPort);
            config(['mail.mailers.smtp.port' => (int) $mailPort]);
        }

        if (! is_null($mailUsername)) {
            Setting::updateValue('mail.username', $mailUsername);
            config(['mail.mailers.smtp.username' => $mailUsername !== '' ? $mailUsername : null]);
        }

        if (! is_null($mailPassword) && $mailPassword !== '') {
            Setting::updateValue('mail.password', $mailPassword);
            config(['mail.mailers.smtp.password' => $mailPassword]);
        }

        if (! is_null($mailFromAddress)) {
            Setting::updateValue('mail.from_address', $mailFromAddress);
            config(['mail.from.address' => $mailFromAddress]);
        }

        if (! is_null($mailFromName)) {
            Setting::updateValue('mail.from_name', $mailFromName);
            config(['mail.from.name' => $mailFromName]);
        }

        config(['app.default_appearance' => $defaultAppearance]);

        app()->setLocale($locale);
        Setting::updateValue('app.locale', $locale);
        $request->session()->put('locale', $locale);

        if ($timezone) {
            $this->updateTimezoneSetting($timezone);
        }

        return back()->with('success', __('admin.settings.application_updated'));
    }

    public function updateTimezone(Request $request): RedirectResponse
    {
        $availableTimezones = config('app.available_timezones', []);

        $validated = $request->validate([
            'timezone' => ['required', 'string', Rule::in($availableTimezones)],
        ]);

        $timezone = $validated['timezone'];
        $this->updateTimezoneSetting($timezone);

        return back()->with('success', __('admin.settings.timezone_updated'));
    }

    protected function updateTimezoneSetting(string $timezone): void
    {
        Setting::updateValue('app.timezone', $timezone);

        config(['app.timezone' => $timezone]);
        $connection = config('database.default');
        $offset = CarbonTimeZone::create($timezone)->toOffsetName();
        config(["database.connections.{$connection}.timezone" => $offset]);
        date_default_timezone_set($timezone);

        $driver = config("database.connections.{$connection}.driver");

        if ($driver !== 'sqlite') {
            $database = DB::connection($connection);

            if ($driver === 'pgsql') {
                $database->statement("SET TIME ZONE '{$timezone}'");
            } elseif (in_array($driver, ['mysql', 'mariadb'])) {
                $database->statement("SET time_zone = '{$offset}'");
            }
        }
    }
}
