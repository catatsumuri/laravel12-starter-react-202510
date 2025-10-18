import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import DebugModeController from '@/actions/App/Http/Controllers/Admin/DebugModeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type DebugSettingsProps = {
  debugEnabled: boolean;
};

export default function DebugSettings({ debugEnabled }: DebugSettingsProps) {
  const { t } = useTranslation();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('navigation.application_settings'),
      href: ApplicationSettingController.edit.url(),
    },
    {
      title: t('admin.settings.debug_mode_title'),
      href: DebugModeController.edit.url(),
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    debug_enabled: debugEnabled ? '1' : '0',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    put(DebugModeController.update.url(), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.settings.debug_mode_title')} />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <Heading
          title={t('admin.settings.debug_mode_title')}
          description={t('admin.settings.debug_mode_description')}
        />

        <div className="max-w-2xl space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t('admin.settings.app_debug_label')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.app_debug_description')}
              </p>
            </div>
            <Badge variant={debugEnabled ? 'default' : 'secondary'}>
              {debugEnabled ? t('common.enabled') : t('common.disabled')}
            </Badge>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {t('admin.settings.debug_mode_toggle_label')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.debug_mode_toggle_description')}
              </p>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-card px-3 py-3 transition-colors hover:bg-accent">
                  <input
                    type="radio"
                    name="debug_enabled"
                    className="mt-1.5 size-4 text-primary focus:ring-2 focus:ring-ring"
                    value="1"
                    checked={data.debug_enabled === '1'}
                    onChange={() => setData('debug_enabled', '1')}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t('admin.settings.debug_mode_enable_option')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.settings.debug_mode_enable_description')}
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-card px-3 py-3 transition-colors hover:bg-accent">
                  <input
                    type="radio"
                    name="debug_enabled"
                    className="mt-1.5 size-4 text-primary focus:ring-2 focus:ring-ring"
                    value="0"
                    checked={data.debug_enabled === '0'}
                    onChange={() => setData('debug_enabled', '0')}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t('admin.settings.debug_mode_disable_option')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.settings.debug_mode_disable_description')}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <InputError className="mt-1" message={errors.debug_enabled} />

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={processing}>
                {t('common.save_changes')}
              </Button>
              <Button asChild variant="ghost">
                <Link href={ApplicationSettingController.edit.url()}>
                  {t('common.cancel')}
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
