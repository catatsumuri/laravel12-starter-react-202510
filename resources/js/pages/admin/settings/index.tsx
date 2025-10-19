import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import DebugModeController from '@/actions/App/Http/Controllers/Admin/DebugModeController';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Monitor, Moon, Settings2, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AppearanceOption = 'light' | 'dark' | 'system';

type AdminSettingsProps = {
  appName: string;
  appUrl: string | null;
  appDebug: boolean;
  allowRegistration: boolean;
  allowAppearanceCustomization: boolean;
  allowTwoFactorAuthentication: boolean;
  allowAccountDeletion: boolean;
  defaultAppearance: AppearanceOption;
  awsAccessKeyId: string | null;
  awsSecretAccessKey: string | null;
  awsDefaultRegion: string | null;
  awsBucket: string | null;
  awsUsePathStyleEndpoint: boolean;
  logChannel: string | null;
  logLevel: string | null;
  logStackChannels: string[] | string;
  logSlackWebhookUrl: string | null;
  logSlackUsername: string | null;
  logSlackEmoji: string | null;
  mailMailer: string | null;
  mailScheme: string | null;
  mailHost: string | null;
  mailPort: string | null;
  mailUsername: string | null;
  mailPassword: string | null;
  mailFromAddress: string | null;
  mailFromName: string | null;
};

type AdminPageProps = SharedData & {
  csrf_token?: string;
  errors?: Record<string, string | string[]>;
  awsAccessKeyId?: string | null;
  awsDefaultRegion?: string | null;
  awsBucket?: string | null;
  awsUsePathStyleEndpoint?: boolean;
  logChannel?: string | null;
  logLevel?: string | null;
  logStackChannels?: string[] | string | null;
  logSlackWebhookUrl?: string | null;
  logSlackUsername?: string | null;
  logSlackEmoji?: string | null;
  mailMailer?: string | null;
  mailScheme?: string | null;
  mailHost?: string | null;
  mailPort?: string | null;
  mailUsername?: string | null;
  mailPassword?: string | null;
  mailFromAddress?: string | null;
  mailFromName?: string | null;
};

export default function AdminSettingsIndex({
  appName,
  appUrl,
  appDebug,
  allowRegistration: initialAllowRegistration,
  allowAppearanceCustomization: initialAllowAppearanceCustomization,
  allowTwoFactorAuthentication: initialAllowTwoFactorAuthentication,
  allowAccountDeletion: initialAllowAccountDeletion,
  defaultAppearance: initialDefaultAppearance,
  awsAccessKeyId: initialAwsAccessKeyId,
  awsSecretAccessKey: initialAwsSecretAccessKey,
  awsDefaultRegion: initialAwsDefaultRegion,
  awsBucket: initialAwsBucket,
  awsUsePathStyleEndpoint: initialAwsUsePathStyleEndpoint,
  logChannel: initialLogChannel,
  logLevel: initialLogLevel,
  logStackChannels,
  logSlackWebhookUrl: initialLogSlackWebhookUrl,
  logSlackUsername: initialLogSlackUsername,
  logSlackEmoji: initialLogSlackEmoji,
  mailMailer: initialMailMailer,
  mailScheme: initialMailScheme,
  mailHost: initialMailHost,
  mailPort: initialMailPort,
  mailUsername: initialMailUsername,
  mailPassword: initialMailPassword,
  mailFromAddress: initialMailFromAddress,
  mailFromName: initialMailFromName,
}: AdminSettingsProps) {
  const { t } = useTranslation();
  const {
    appUrl: sharedAppUrl,
    availableLocales = [],
    locale,
    availableTimezones = [],
    timezone,
    csrf_token,
    allowRegistration: sharedAllowRegistration,
    allowAppearanceCustomization: sharedAllowAppearanceCustomization,
    allowTwoFactorAuthentication: sharedAllowTwoFactorAuthentication,
    allowAccountDeletion: sharedAllowAccountDeletion,
    awsAccessKeyId: sharedAwsAccessKeyId,
    awsDefaultRegion: sharedAwsDefaultRegion,
    awsBucket: sharedAwsBucket,
    awsUsePathStyleEndpoint: sharedAwsUsePathStyleEndpoint,
    logChannel: sharedLogChannel,
    logLevel: sharedLogLevel,
    logStackChannels: sharedLogStackChannels,
    logSlackWebhookUrl: sharedLogSlackWebhookUrl,
    logSlackUsername: sharedLogSlackUsername,
    logSlackEmoji: sharedLogSlackEmoji,
    mailMailer: sharedMailMailer,
    mailScheme: sharedMailScheme,
    mailHost: sharedMailHost,
    mailPort: sharedMailPort,
    mailUsername: sharedMailUsername,
    mailPassword: sharedMailPassword,
    mailFromAddress: sharedMailFromAddress,
    mailFromName: sharedMailFromName,
    defaultAppearance: sharedDefaultAppearance,
    errors: pageErrors = {},
  } = usePage<AdminPageProps>().props;

  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [selectedTimezone, setSelectedTimezone] = useState(
    timezone ?? availableTimezones[0] ?? '',
  );
  const [appUrlState, setAppUrlState] = useState(appUrl ?? '');
  const derivedAllowRegistration =
    typeof sharedAllowRegistration === 'boolean'
      ? sharedAllowRegistration
      : initialAllowRegistration;
  const [allowRegistration, setAllowRegistration] = useState(
    derivedAllowRegistration,
  );
  const derivedAllowAppearanceCustomization =
    typeof sharedAllowAppearanceCustomization === 'boolean'
      ? sharedAllowAppearanceCustomization
      : initialAllowAppearanceCustomization;
  const [allowAppearanceCustomization, setAllowAppearanceCustomization] =
    useState(derivedAllowAppearanceCustomization);
  const derivedAllowTwoFactorAuthentication =
    typeof sharedAllowTwoFactorAuthentication === 'boolean'
      ? sharedAllowTwoFactorAuthentication
      : initialAllowTwoFactorAuthentication;
  const [allowTwoFactorAuthentication, setAllowTwoFactorAuthentication] =
    useState(derivedAllowTwoFactorAuthentication);
  const derivedAllowAccountDeletion =
    typeof sharedAllowAccountDeletion === 'boolean'
      ? sharedAllowAccountDeletion
      : initialAllowAccountDeletion;
  const [allowAccountDeletion, setAllowAccountDeletion] = useState(
    derivedAllowAccountDeletion,
  );
  const [awsAccessKeyId, setAwsAccessKeyId] = useState(
    initialAwsAccessKeyId ?? '',
  );
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState(
    initialAwsSecretAccessKey ?? '',
  );
  const [awsDefaultRegion, setAwsDefaultRegion] = useState(
    initialAwsDefaultRegion ?? 'us-east-1',
  );
  const [awsBucket, setAwsBucket] = useState(initialAwsBucket ?? '');
  const [awsUsePathStyleEndpoint, setAwsUsePathStyleEndpoint] = useState(
    initialAwsUsePathStyleEndpoint,
  );
  const parseStackMembers = (value?: string | string[] | null) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item.length > 0);
    }

    if (typeof value === 'string' && value.length > 0) {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return [];
  };

  const [logChannel, setLogChannel] = useState(initialLogChannel ?? 'stack');
  const [logLevel, setLogLevel] = useState(initialLogLevel ?? 'debug');
  const [stackMembers, setStackMembers] = useState(() => {
    const initial = parseStackMembers(logStackChannels);

    return initial.length > 0 ? initial : ['single'];
  });
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(
    initialLogSlackWebhookUrl ?? '',
  );
  const [slackUsername, setSlackUsername] = useState(
    initialLogSlackUsername ?? '',
  );
  const [slackEmoji, setSlackEmoji] = useState(initialLogSlackEmoji ?? '');
  const [customStackChannel, setCustomStackChannel] = useState('');
  const [mailMailer, setMailMailer] = useState(initialMailMailer ?? 'log');
  const [mailScheme, setMailScheme] = useState(initialMailScheme ?? '');
  const [mailHost, setMailHost] = useState(initialMailHost ?? '127.0.0.1');
  const [mailPort, setMailPort] = useState(initialMailPort ?? '2525');
  const [mailUsername, setMailUsername] = useState(initialMailUsername ?? '');
  const [mailPassword, setMailPassword] = useState(initialMailPassword ?? '');
  const [mailFromAddress, setMailFromAddress] = useState(
    initialMailFromAddress ?? 'hello@example.com',
  );
  const [mailFromName, setMailFromName] = useState(
    initialMailFromName ?? appName,
  );

  const smtpMailers = ['smtp'];
  const envConfiguredMailers = [
    'failover',
    'roundrobin',
    'ses',
    'postmark',
    'resend',
    'sendmail',
  ];
  const logChannels = [
    'stack',
    'single',
    'daily',
    'slack',
    'syslog',
    'errorlog',
    'null',
  ];
  const stackSelectableChannels = logChannels.filter(
    (channel) => channel !== 'stack',
  );
  const logLevels = [
    'debug',
    'info',
    'notice',
    'warning',
    'error',
    'critical',
    'alert',
    'emergency',
  ];
  const advancedLogChannels = ['slack', 'syslog', 'errorlog'];

  const stackMemberSet = useMemo(() => new Set(stackMembers), [stackMembers]);

  const showSmtpFields = smtpMailers.includes(mailMailer);
  const showEnvWarning = envConfiguredMailers.includes(mailMailer);
  const showSlackFields =
    logChannel === 'slack' ||
    (logChannel === 'stack' && stackMemberSet.has('slack'));
  const showLogWarning =
    advancedLogChannels.includes(logChannel) ||
    stackMembers.some((member) => advancedLogChannels.includes(member));

  const handleStackMemberToggle = (channel: string, enabled: boolean) => {
    setStackMembers((previous) => {
      const next = enabled
        ? Array.from(new Set([...previous, channel]))
        : previous.filter((item) => item !== channel);

      return next.length > 0 ? next : ['single'];
    });
  };

  const handleAddStackChannel = () => {
    const trimmed = customStackChannel.trim();

    if (!trimmed) {
      return;
    }

    setStackMembers((previous) => {
      if (previous.includes(trimmed)) {
        return previous;
      }

      return [...previous, trimmed];
    });

    setCustomStackChannel('');
  };
  const derivedDefaultAppearance =
    typeof sharedDefaultAppearance === 'string' &&
    ['light', 'dark', 'system'].includes(sharedDefaultAppearance)
      ? (sharedDefaultAppearance as AppearanceOption)
      : initialDefaultAppearance;
  const [defaultAppearance, setDefaultAppearance] = useState<AppearanceOption>(
    derivedDefaultAppearance,
  );

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    setSelectedTimezone(timezone ?? availableTimezones[0] ?? '');
  }, [timezone, availableTimezones]);

  useEffect(() => {
    if (typeof sharedAppUrl === 'string') {
      setAppUrlState(sharedAppUrl);
    } else if (appUrl) {
      setAppUrlState(appUrl);
    }
  }, [sharedAppUrl, appUrl]);

  useEffect(() => {
    setAllowRegistration(derivedAllowRegistration);
  }, [derivedAllowRegistration]);

  useEffect(() => {
    setAllowAppearanceCustomization(derivedAllowAppearanceCustomization);
  }, [derivedAllowAppearanceCustomization]);

  useEffect(() => {
    setAllowTwoFactorAuthentication(derivedAllowTwoFactorAuthentication);
  }, [derivedAllowTwoFactorAuthentication]);

  useEffect(() => {
    setAllowAccountDeletion(derivedAllowAccountDeletion);
  }, [derivedAllowAccountDeletion]);

  useEffect(() => {
    if (typeof sharedAwsAccessKeyId === 'string') {
      setAwsAccessKeyId(sharedAwsAccessKeyId);
    } else if (initialAwsAccessKeyId) {
      setAwsAccessKeyId(initialAwsAccessKeyId);
    }
  }, [sharedAwsAccessKeyId, initialAwsAccessKeyId]);

  useEffect(() => {
    if (typeof sharedAwsDefaultRegion === 'string') {
      setAwsDefaultRegion(sharedAwsDefaultRegion);
    } else if (initialAwsDefaultRegion) {
      setAwsDefaultRegion(initialAwsDefaultRegion);
    }
  }, [sharedAwsDefaultRegion, initialAwsDefaultRegion]);

  useEffect(() => {
    if (typeof sharedAwsBucket === 'string') {
      setAwsBucket(sharedAwsBucket);
    } else if (initialAwsBucket) {
      setAwsBucket(initialAwsBucket);
    }
  }, [sharedAwsBucket, initialAwsBucket]);

  useEffect(() => {
    if (typeof sharedAwsUsePathStyleEndpoint === 'boolean') {
      setAwsUsePathStyleEndpoint(sharedAwsUsePathStyleEndpoint);
    } else {
      setAwsUsePathStyleEndpoint(initialAwsUsePathStyleEndpoint);
    }
  }, [sharedAwsUsePathStyleEndpoint, initialAwsUsePathStyleEndpoint]);

  useEffect(() => {
    if (typeof sharedMailMailer === 'string') {
      setMailMailer(sharedMailMailer);
    } else if (initialMailMailer) {
      setMailMailer(initialMailMailer);
    }
  }, [sharedMailMailer, initialMailMailer]);

  useEffect(() => {
    if (typeof sharedMailScheme === 'string') {
      setMailScheme(sharedMailScheme);
    } else if (initialMailScheme !== null) {
      setMailScheme(initialMailScheme ?? '');
    }
  }, [sharedMailScheme, initialMailScheme]);

  useEffect(() => {
    if (typeof sharedMailHost === 'string') {
      setMailHost(sharedMailHost);
    } else if (initialMailHost) {
      setMailHost(initialMailHost);
    }
  }, [sharedMailHost, initialMailHost]);

  useEffect(() => {
    if (typeof sharedMailPort === 'string') {
      setMailPort(sharedMailPort);
    } else if (initialMailPort) {
      setMailPort(initialMailPort);
    }
  }, [sharedMailPort, initialMailPort]);

  useEffect(() => {
    if (typeof sharedMailUsername === 'string') {
      setMailUsername(sharedMailUsername);
    } else if (initialMailUsername !== null) {
      setMailUsername(initialMailUsername ?? '');
    }
  }, [sharedMailUsername, initialMailUsername]);

  useEffect(() => {
    if (typeof sharedMailPassword === 'string') {
      setMailPassword(sharedMailPassword);
    } else if (initialMailPassword !== null) {
      setMailPassword(initialMailPassword ?? '');
    }
  }, [sharedMailPassword, initialMailPassword]);

  useEffect(() => {
    if (typeof sharedMailFromAddress === 'string') {
      setMailFromAddress(sharedMailFromAddress);
    } else if (initialMailFromAddress) {
      setMailFromAddress(initialMailFromAddress);
    }
  }, [sharedMailFromAddress, initialMailFromAddress]);

  useEffect(() => {
    if (typeof sharedMailFromName === 'string') {
      setMailFromName(sharedMailFromName);
    } else if (initialMailFromName) {
      setMailFromName(initialMailFromName);
    }
  }, [sharedMailFromName, initialMailFromName]);

  useEffect(() => {
    if (typeof sharedLogChannel === 'string') {
      setLogChannel(sharedLogChannel);
    } else if (initialLogChannel) {
      setLogChannel(initialLogChannel);
    }
  }, [sharedLogChannel, initialLogChannel]);

  useEffect(() => {
    if (typeof sharedLogLevel === 'string') {
      setLogLevel(sharedLogLevel);
    } else if (initialLogLevel) {
      setLogLevel(initialLogLevel);
    }
  }, [sharedLogLevel, initialLogLevel]);

  useEffect(() => {
    const nextMembers = parseStackMembers(
      sharedLogStackChannels ?? logStackChannels,
    );

    setStackMembers(nextMembers.length > 0 ? nextMembers : ['single']);
  }, [sharedLogStackChannels, logStackChannels]);

  useEffect(() => {
    if (typeof sharedLogSlackWebhookUrl === 'string') {
      setSlackWebhookUrl(sharedLogSlackWebhookUrl);
    } else if (initialLogSlackWebhookUrl) {
      setSlackWebhookUrl(initialLogSlackWebhookUrl);
    }
  }, [sharedLogSlackWebhookUrl, initialLogSlackWebhookUrl]);

  useEffect(() => {
    if (typeof sharedLogSlackUsername === 'string') {
      setSlackUsername(sharedLogSlackUsername);
    } else if (initialLogSlackUsername !== null) {
      setSlackUsername(initialLogSlackUsername ?? '');
    }
  }, [sharedLogSlackUsername, initialLogSlackUsername]);

  useEffect(() => {
    if (typeof sharedLogSlackEmoji === 'string') {
      setSlackEmoji(sharedLogSlackEmoji);
    } else if (initialLogSlackEmoji !== null) {
      setSlackEmoji(initialLogSlackEmoji ?? '');
    }
  }, [sharedLogSlackEmoji, initialLogSlackEmoji]);

  useEffect(() => {
    setDefaultAppearance(derivedDefaultAppearance);
  }, [derivedDefaultAppearance]);

  const appearanceOptions = useMemo(
    () => [
      {
        value: 'light' as AppearanceOption,
        icon: Sun,
        label: t('admin.settings.default_appearance_light'),
      },
      {
        value: 'dark' as AppearanceOption,
        icon: Moon,
        label: t('admin.settings.default_appearance_dark'),
      },
      {
        value: 'system' as AppearanceOption,
        icon: Monitor,
        label: t('admin.settings.default_appearance_system'),
      },
    ],
    [t],
  );

  const sectionAnchors = useMemo(
    () => [
      {
        id: 'general-settings',
        label: t('admin.settings.section_general_title'),
      },
      {
        id: 'access-settings',
        label: t('admin.settings.section_access_title'),
      },
      {
        id: 'appearance-settings',
        label: t('admin.settings.section_appearance_title'),
      },
      {
        id: 'security-settings',
        label: t('admin.settings.section_security_title'),
      },
      {
        id: 'logging-settings',
        label: t('admin.settings.section_logging_title'),
      },
      {
        id: 'storage-settings',
        label: t('admin.settings.section_storage_title'),
      },
      {
        id: 'mail-settings',
        label: t('admin.settings.section_mail_title'),
      },
    ],
    [t],
  );

  const getError = (field: string): string | undefined => {
    const message = (
      pageErrors as Record<string, string | string[] | undefined>
    )[field];

    if (Array.isArray(message)) {
      return message[0];
    }

    return message;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('navigation.application_settings'),
      href: ApplicationSettingController.edit.url(),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.settings.title')} />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <div className="max-w-2xl space-y-6">
          <Heading
            title={t('admin.settings.title')}
            description={t('admin.settings.description')}
          />

          <nav aria-label={t('admin.settings.title')} className="text-sm">
            <ul className="flex flex-wrap gap-2">
              {sectionAnchors.map(({ id, label }) => (
                <li key={id}>
                  <a
                    className="rounded-md border border-border bg-muted px-3 py-1 text-muted-foreground transition hover:bg-background hover:text-foreground"
                    href={`#${id}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <form
            action={ApplicationSettingController.update.url()}
            method="post"
            className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <input type="hidden" name="_method" value="PUT" />
            <input type="hidden" name="_token" value={csrf_token ?? ''} />
            <input
              type="hidden"
              name="allow_registration"
              value={allowRegistration ? '1' : '0'}
            />
            <input
              type="hidden"
              name="allow_appearance_customization"
              value={allowAppearanceCustomization ? '1' : '0'}
            />
            <input
              type="hidden"
              name="allow_two_factor_authentication"
              value={allowTwoFactorAuthentication ? '1' : '0'}
            />
            <input
              type="hidden"
              name="allow_account_deletion"
              value={allowAccountDeletion ? '1' : '0'}
            />
            <input
              type="hidden"
              name="aws_use_path_style_endpoint"
              value={awsUsePathStyleEndpoint ? '1' : '0'}
            />
            <input type="hidden" name="log_channel" value={logChannel} />
            <input type="hidden" name="log_level" value={logLevel} />
            <input
              type="hidden"
              name="log_stack_channels"
              value={stackMembers.join(',')}
            />
            <input type="hidden" name="log_channel" value={logChannel} />
            <input type="hidden" name="log_level" value={logLevel} />
            <input
              type="hidden"
              name="default_appearance"
              value={defaultAppearance}
            />

            <section id="general-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_general_title')}
                description={t('admin.settings.section_general_description')}
              />

              <div className="space-y-2">
                <Label htmlFor="app_name">{t('common.application_name')}</Label>
                <Input
                  id="app_name"
                  name="app_name"
                  defaultValue={appName}
                  placeholder={t('common.application_name_placeholder')}
                  required
                  maxLength={255}
                />
                <InputError className="mt-1" message={getError('app_name')} />
                <p className="text-sm text-muted-foreground">
                  {t('common.application_name_helper')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app_url">
                  {t('admin.settings.app_url_label')}
                </Label>
                <Input
                  id="app_url"
                  name="app_url"
                  type="url"
                  placeholder="https://example.com"
                  value={appUrlState}
                  onChange={(event) => setAppUrlState(event.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.app_url_description')}
                </p>
                <InputError className="mt-1" message={getError('app_url')} />
              </div>

              {availableLocales.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="locale">
                    {t('admin.settings.locale_title')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.settings.locale_description')}
                  </p>
                  <select
                    id="locale"
                    name="locale"
                    className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    value={selectedLocale}
                    onChange={(event) => setSelectedLocale(event.target.value)}
                    required
                  >
                    {availableLocales.map((value) => (
                      <option key={value} value={value}>
                        {t(`locales.${value}`)}
                      </option>
                    ))}
                  </select>
                  <InputError className="mt-1" message={getError('locale')} />
                </div>
              )}

              {availableTimezones.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    {t('admin.settings.timezone_title')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.settings.timezone_description')}
                  </p>
                  <select
                    id="timezone"
                    name="timezone"
                    className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    value={selectedTimezone}
                    onChange={(event) =>
                      setSelectedTimezone(event.target.value)
                    }
                    required
                  >
                    {availableTimezones.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <InputError className="mt-1" message={getError('timezone')} />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {t('admin.settings.app_debug_label')}
                  </p>
                  <Badge variant={appDebug ? 'default' : 'secondary'}>
                    {appDebug ? t('common.enabled') : t('common.disabled')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.app_debug_description')}
                </p>
                <Button asChild variant="default" size="sm">
                  <Link
                    href={DebugModeController.edit.url()}
                    className="inline-flex items-center gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    {t('admin.settings.debug_mode_manage_button')}
                  </Link>
                </Button>
              </div>
            </section>

            <hr className="border-border" />

            <section id="access-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_access_title')}
                description={t('admin.settings.section_access_description')}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="allow_registration"
                    checked={allowRegistration}
                    onCheckedChange={(checked) =>
                      setAllowRegistration(checked === true)
                    }
                  />
                  <Label
                    htmlFor="allow_registration"
                    className="text-sm text-foreground"
                  >
                    {t('admin.settings.allow_registration_label')}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.allow_registration_description')}
                </p>
                <InputError
                  className="mt-1"
                  message={getError('allow_registration')}
                />
              </div>
            </section>

            <hr className="border-border" />

            <section id="appearance-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_appearance_title')}
                description={t('admin.settings.section_appearance_description')}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="allow_appearance_customization"
                    checked={allowAppearanceCustomization}
                    onCheckedChange={(checked) =>
                      setAllowAppearanceCustomization(checked === true)
                    }
                  />
                  <Label
                    htmlFor="allow_appearance_customization"
                    className="text-sm text-foreground"
                  >
                    {t('admin.settings.allow_appearance_label')}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.allow_appearance_description')}
                </p>
                <InputError
                  className="mt-1"
                  message={getError('allow_appearance_customization')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_appearance">
                  {t('admin.settings.default_appearance_title')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.default_appearance_description')}
                </p>
                <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                  {appearanceOptions.map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDefaultAppearance(value)}
                      className={`flex items-center rounded-md px-3.5 py-1.5 text-sm transition-colors ${
                        defaultAppearance === value
                          ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                          : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
                      }`}
                    >
                      <Icon className="-ml-1 h-4 w-4" />
                      <span className="ml-1.5">{label}</span>
                    </button>
                  ))}
                </div>
                <InputError
                  className="mt-1"
                  message={getError('default_appearance')}
                />
              </div>
            </section>

            <hr className="border-border" />

            <section id="security-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_security_title')}
                description={t('admin.settings.section_security_description')}
              />

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="allow_two_factor_authentication"
                    checked={allowTwoFactorAuthentication}
                    onCheckedChange={(checked) =>
                      setAllowTwoFactorAuthentication(checked === true)
                    }
                  />
                  <Label
                    htmlFor="allow_two_factor_authentication"
                    className="text-sm text-foreground"
                  >
                    {t('admin.settings.allow_two_factor_label')}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.allow_two_factor_description')}
                </p>
                <InputError
                  className="mt-1"
                  message={getError('allow_two_factor_authentication')}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="allow_account_deletion"
                    checked={allowAccountDeletion}
                    onCheckedChange={(checked) =>
                      setAllowAccountDeletion(checked === true)
                    }
                  />
                  <Label
                    htmlFor="allow_account_deletion"
                    className="text-sm text-foreground"
                  >
                    {t('admin.settings.allow_account_deletion_label')}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.allow_account_deletion_description')}
                </p>
                <InputError
                  className="mt-1"
                  message={getError('allow_account_deletion')}
                />
              </div>
            </section>

            <hr className="border-border" />

            <section id="logging-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_logging_title')}
                description={t('admin.settings.section_logging_description')}
              />

              <div className="space-y-2">
                <Label htmlFor="log_channel">
                  {t('admin.settings.log_channel_label')}
                </Label>
                <Select
                  value={logChannel}
                  onValueChange={(value) => setLogChannel(value)}
                >
                  <SelectTrigger id="log_channel">
                    <SelectValue placeholder="stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {logChannels.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {t(`admin.settings.log_channel_option_${channel}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.log_channel_description')}
                </p>
                {logChannel === 'stack' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t('admin.settings.log_stack_channels_description')}
                    </p>

                    <div className="grid gap-2 md:grid-cols-2">
                      {stackSelectableChannels.map((channel) => {
                        const checked = stackMemberSet.has(channel);

                        return (
                          <label
                            key={channel}
                            htmlFor={`stack-channel-${channel}`}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Checkbox
                              id={`stack-channel-${channel}`}
                              checked={checked}
                              onCheckedChange={(state) =>
                                handleStackMemberToggle(channel, state === true)
                              }
                            />
                            <span>
                              {t(
                                `admin.settings.log_channel_option_${channel}`,
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        className="max-w-xs"
                        value={customStackChannel}
                        onChange={(event) =>
                          setCustomStackChannel(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            handleAddStackChannel();
                          }
                        }}
                        placeholder={t(
                          'admin.settings.log_stack_channels_add_placeholder',
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddStackChannel}
                      >
                        {t('admin.settings.log_stack_channels_add_button')}
                      </Button>
                    </div>

                    {stackMembers.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t('admin.settings.log_stack_channels_label', {
                          channels: stackMembers.join(', '),
                        })}
                      </p>
                    ) : (
                      <p className="text-sm text-destructive">
                        {t('admin.settings.log_stack_channels_empty_warning')}
                      </p>
                    )}
                  </div>
                )}
                {showLogWarning && (
                  <Alert className="mt-2">
                    <AlertDescription>
                      {t('admin.settings.log_channel_warning')}
                    </AlertDescription>
                  </Alert>
                )}
                <InputError
                  className="mt-1"
                  message={getError('log_channel')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="log_level">
                  {t('admin.settings.log_level_label')}
                </Label>
                <Select
                  value={logLevel}
                  onValueChange={(value) => setLogLevel(value)}
                >
                  <SelectTrigger id="log_level">
                    <SelectValue placeholder="debug" />
                  </SelectTrigger>
                  <SelectContent>
                    {logLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {t(`admin.settings.log_level_option_${level}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.log_level_description')}
                </p>
                <InputError className="mt-1" message={getError('log_level')} />
              </div>

              {showSlackFields && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="log_slack_webhook_url">
                      {t('admin.settings.log_slack_webhook_url_label')}
                    </Label>
                    <Input
                      id="log_slack_webhook_url"
                      name="log_slack_webhook_url"
                      type="url"
                      value={slackWebhookUrl}
                      onChange={(event) =>
                        setSlackWebhookUrl(event.target.value)
                      }
                      placeholder="https://hooks.slack.com/services/..."
                    />
                    <InputError
                      className="mt-1"
                      message={getError('log_slack_webhook_url')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="log_slack_username">
                      {t('admin.settings.log_slack_username_label')}
                    </Label>
                    <Input
                      id="log_slack_username"
                      name="log_slack_username"
                      value={slackUsername}
                      onChange={(event) => setSlackUsername(event.target.value)}
                      placeholder="LoggerBot"
                      autoComplete="off"
                    />
                    <InputError
                      className="mt-1"
                      message={getError('log_slack_username')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="log_slack_emoji">
                      {t('admin.settings.log_slack_emoji_label')}
                    </Label>
                    <Input
                      id="log_slack_emoji"
                      name="log_slack_emoji"
                      value={slackEmoji}
                      onChange={(event) => setSlackEmoji(event.target.value)}
                      placeholder=":bell:"
                      autoComplete="off"
                    />
                    <InputError
                      className="mt-1"
                      message={getError('log_slack_emoji')}
                    />
                  </div>
                </div>
              )}
            </section>

            <hr className="border-border" />

            <section id="storage-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_storage_title')}
                description={t('admin.settings.section_storage_description')}
              />

              <div className="space-y-2">
                <Label htmlFor="aws_access_key_id">
                  {t('admin.settings.aws_access_key_id_label')}
                </Label>
                <Input
                  id="aws_access_key_id"
                  name="aws_access_key_id"
                  value={awsAccessKeyId}
                  onChange={(event) => setAwsAccessKeyId(event.target.value)}
                  placeholder="AKI..."
                  spellCheck={false}
                  autoComplete="off"
                />
                <InputError
                  className="mt-1"
                  message={getError('aws_access_key_id')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aws_secret_access_key">
                  {t('admin.settings.aws_secret_access_key_label')}
                </Label>
                <Input
                  id="aws_secret_access_key"
                  name="aws_secret_access_key"
                  type="password"
                  value={awsSecretAccessKey}
                  onChange={(event) =>
                    setAwsSecretAccessKey(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="off"
                />
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.aws_secret_access_key_helper')}
                </p>
                <InputError
                  className="mt-1"
                  message={getError('aws_secret_access_key')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aws_default_region">
                  {t('admin.settings.aws_default_region_label')}
                </Label>
                <Input
                  id="aws_default_region"
                  name="aws_default_region"
                  value={awsDefaultRegion}
                  onChange={(event) => setAwsDefaultRegion(event.target.value)}
                  placeholder="us-east-1"
                  spellCheck={false}
                />
                <InputError
                  className="mt-1"
                  message={getError('aws_default_region')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aws_bucket">
                  {t('admin.settings.aws_bucket_label')}
                </Label>
                <Input
                  id="aws_bucket"
                  name="aws_bucket"
                  value={awsBucket}
                  onChange={(event) => setAwsBucket(event.target.value)}
                  placeholder="my-s3-bucket"
                />
                <InputError className="mt-1" message={getError('aws_bucket')} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="aws_use_path_style_endpoint"
                    checked={awsUsePathStyleEndpoint}
                    onCheckedChange={(checked) =>
                      setAwsUsePathStyleEndpoint(checked === true)
                    }
                  />
                  <Label
                    htmlFor="aws_use_path_style_endpoint"
                    className="text-sm text-foreground"
                  >
                    {t('admin.settings.aws_use_path_style_endpoint_label')}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.aws_use_path_style_endpoint_description')}
                </p>
                <InputError
                  className="mt-1"
                  message={getError('aws_use_path_style_endpoint')}
                />
              </div>
            </section>

            <hr className="border-border" />

            <section id="mail-settings" className="space-y-4">
              <HeadingSmall
                title={t('admin.settings.section_mail_title')}
                description={t('admin.settings.section_mail_description')}
              />

              <input type="hidden" name="mail_mailer" value={mailMailer} />

              <div className="space-y-2">
                <Label htmlFor="mail_mailer">
                  {t('admin.settings.mail_mailer_label')}
                </Label>
                <Select
                  value={mailMailer}
                  onValueChange={(value) => setMailMailer(value)}
                >
                  <SelectTrigger id="mail_mailer" name="mail_mailer">
                    <SelectValue placeholder="log" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="log">log</SelectItem>
                    <SelectItem value="smtp">smtp</SelectItem>
                    <SelectItem value="sendmail">sendmail</SelectItem>
                    <SelectItem value="ses">ses</SelectItem>
                    <SelectItem value="postmark">postmark</SelectItem>
                    <SelectItem value="resend">resend</SelectItem>
                    <SelectItem value="array">array</SelectItem>
                    <SelectItem value="failover">failover</SelectItem>
                    <SelectItem value="roundrobin">roundrobin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t('admin.settings.mail_mailer_helper')}
                </p>
                {showEnvWarning && (
                  <Alert className="mt-2">
                    <AlertDescription>
                      {t('admin.settings.mail_mailer_warning')}
                    </AlertDescription>
                  </Alert>
                )}
                <InputError
                  className="mt-1"
                  message={getError('mail_mailer')}
                />
              </div>

              {showSmtpFields && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mail_scheme">
                      {t('admin.settings.mail_scheme_label')}
                    </Label>
                    <Input
                      id="mail_scheme"
                      name="mail_scheme"
                      value={mailScheme}
                      onChange={(event) => setMailScheme(event.target.value)}
                      placeholder="smtp"
                      spellCheck={false}
                    />
                    <InputError
                      className="mt-1"
                      message={getError('mail_scheme')}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mail_host">
                        {t('admin.settings.mail_host_label')}
                      </Label>
                      <Input
                        id="mail_host"
                        name="mail_host"
                        value={mailHost}
                        onChange={(event) => setMailHost(event.target.value)}
                        placeholder="127.0.0.1"
                        spellCheck={false}
                      />
                      <InputError
                        className="mt-1"
                        message={getError('mail_host')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mail_port">
                        {t('admin.settings.mail_port_label')}
                      </Label>
                      <Input
                        id="mail_port"
                        name="mail_port"
                        type="number"
                        value={mailPort}
                        onChange={(event) => setMailPort(event.target.value)}
                        placeholder="2525"
                      />
                      <InputError
                        className="mt-1"
                        message={getError('mail_port')}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mail_username">
                        {t('admin.settings.mail_username_label')}
                      </Label>
                      <Input
                        id="mail_username"
                        name="mail_username"
                        value={mailUsername}
                        onChange={(event) =>
                          setMailUsername(event.target.value)
                        }
                        placeholder=""
                        autoComplete="off"
                      />
                      <InputError
                        className="mt-1"
                        message={getError('mail_username')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mail_password">
                        {t('admin.settings.mail_password_label')}
                      </Label>
                      <Input
                        id="mail_password"
                        name="mail_password"
                        type="password"
                        value={mailPassword}
                        onChange={(event) =>
                          setMailPassword(event.target.value)
                        }
                        placeholder="••••••••"
                        autoComplete="off"
                      />
                      <p className="text-sm text-muted-foreground">
                        {t('admin.settings.mail_password_helper')}
                      </p>
                      <InputError
                        className="mt-1"
                        message={getError('mail_password')}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mail_from_address">
                    {t('admin.settings.mail_from_address_label')}
                  </Label>
                  <Input
                    id="mail_from_address"
                    name="mail_from_address"
                    value={mailFromAddress}
                    onChange={(event) => setMailFromAddress(event.target.value)}
                    placeholder="hello@example.com"
                    type="email"
                  />
                  <InputError
                    className="mt-1"
                    message={getError('mail_from_address')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_from_name">
                    {t('admin.settings.mail_from_name_label')}
                  </Label>
                  <Input
                    id="mail_from_name"
                    name="mail_from_name"
                    value={mailFromName}
                    onChange={(event) => setMailFromName(event.target.value)}
                    placeholder={appName}
                  />
                  <InputError
                    className="mt-1"
                    message={getError('mail_from_name')}
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-4">
              <Button type="submit">{t('common.save_changes')}</Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
