import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AdminSettingsProps = {
  appName: string;
};

type AdminPageProps = SharedData & {
  csrf_token?: string;
};

export default function AdminSettingsIndex({ appName }: AdminSettingsProps) {
  const { t } = useTranslation();
  const { availableLocales, locale, availableTimezones, timezone, csrf_token } =
    usePage<AdminPageProps>().props;
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);
  useEffect(() => {
    setSelectedTimezone(timezone);
  }, [timezone]);
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

          <Form
            {...ApplicationSettingController.update.form()}
            options={{
              preserveScroll: true,
            }}
            className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            {({ processing, errors, recentlySuccessful }) => (
              <>
                <div className="space-y-2">
                  <Label htmlFor="app_name">
                    {t('common.application_name')}
                  </Label>
                  <Input
                    id="app_name"
                    name="app_name"
                    defaultValue={appName}
                    placeholder={t('common.application_name_placeholder')}
                    required
                    maxLength={255}
                    disabled={processing}
                  />
                  <InputError className="mt-1" message={errors.app_name} />
                  <p className="text-sm text-muted-foreground">
                    {t('common.application_name_helper')}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button disabled={processing}>
                    {t('common.save_changes')}
                  </Button>
                  {recentlySuccessful && (
                    <span className="text-sm text-muted-foreground">
                      {t('common.saved')}
                    </span>
                  )}
                </div>
              </>
            )}
          </Form>

          {availableLocales && availableLocales.length > 0 && (
            <form
              action={ApplicationSettingController.updateLocale.url()}
              method="post"
              className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <input type="hidden" name="_token" value={csrf_token ?? ''} />

              <div className="space-y-2">
                <Heading
                  title={t('admin.settings.locale_title')}
                  description={t('admin.settings.locale_description')}
                />
                <Label htmlFor="locale">
                  {t('admin.settings.locale_label')}
                </Label>
                <select
                  id="locale"
                  name="locale"
                  className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  value={selectedLocale}
                  onChange={(event) => setSelectedLocale(event.target.value)}
                >
                  {availableLocales.map((value) => (
                    <option key={value} value={value}>
                      {t(`locales.${value}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit">{t('common.save')}</Button>
              </div>
            </form>
          )}

          {availableTimezones && availableTimezones.length > 0 && (
            <form
              action={ApplicationSettingController.updateTimezone.url()}
              method="post"
              className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <input type="hidden" name="_token" value={csrf_token ?? ''} />

              <div className="space-y-2">
                <Heading
                  title={t('admin.settings.timezone_title')}
                  description={t('admin.settings.timezone_description')}
                />
                <Label htmlFor="timezone">
                  {t('admin.settings.timezone_label')}
                </Label>
                <select
                  id="timezone"
                  name="timezone"
                  className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  value={selectedTimezone}
                  onChange={(event) => setSelectedTimezone(event.target.value)}
                >
                  {availableTimezones.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit">{t('common.save')}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
