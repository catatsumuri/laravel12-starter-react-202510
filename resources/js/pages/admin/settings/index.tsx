import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import DebugModeController from '@/actions/App/Http/Controllers/Admin/DebugModeController';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Monitor, Moon, Settings2, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AppearanceOption = 'light' | 'dark' | 'system';

type AdminSettingsProps = {
  appName: string;
  appDebug: boolean;
  allowRegistration: boolean;
  allowAppearanceCustomization: boolean;
  allowTwoFactorAuthentication: boolean;
  allowAccountDeletion: boolean;
  defaultAppearance: AppearanceOption;
};

type AdminPageProps = SharedData & {
  csrf_token?: string;
  errors?: Record<string, string | string[]>;
};

export default function AdminSettingsIndex({
  appName,
  appDebug,
  allowRegistration: initialAllowRegistration,
  allowAppearanceCustomization: initialAllowAppearanceCustomization,
  allowTwoFactorAuthentication: initialAllowTwoFactorAuthentication,
  allowAccountDeletion: initialAllowAccountDeletion,
  defaultAppearance: initialDefaultAppearance,
}: AdminSettingsProps) {
  const { t } = useTranslation();
  const {
    availableLocales = [],
    locale,
    availableTimezones = [],
    timezone,
    csrf_token,
    allowRegistration: sharedAllowRegistration,
    allowAppearanceCustomization: sharedAllowAppearanceCustomization,
    allowTwoFactorAuthentication: sharedAllowTwoFactorAuthentication,
    allowAccountDeletion: sharedAllowAccountDeletion,
    defaultAppearance: sharedDefaultAppearance,
    errors: pageErrors = {},
  } = usePage<AdminPageProps>().props;

  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [selectedTimezone, setSelectedTimezone] = useState(
    timezone ?? availableTimezones[0] ?? '',
  );
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

            <div className="flex items-center gap-4">
              <Button type="submit">{t('common.save_changes')}</Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
