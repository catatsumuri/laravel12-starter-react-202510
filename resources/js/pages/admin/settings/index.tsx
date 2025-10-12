import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function AdminSettingsIndex({ appName }: { appName: string }) {
  const { t } = useTranslation();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('navigation.application_settings'),
      href: ApplicationSettingController.edit.url(),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.settings.title')} />

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
                <Label htmlFor="app_name">{t('common.application_name')}</Label>
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
      </div>
    </AppLayout>
  );
}
