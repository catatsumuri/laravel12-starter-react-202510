import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin settings',
    href: ApplicationSettingController.edit.url(),
  },
];

export default function AdminSettingsIndex({ appName }: { appName: string }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Application settings" />

      <div className="max-w-2xl space-y-6">
        <Heading
          title="Application settings"
          description="Update the core application configuration."
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
                <Label htmlFor="app_name">Application name</Label>
                <Input
                  id="app_name"
                  name="app_name"
                  defaultValue={appName}
                  placeholder="Enter application name"
                  required
                  maxLength={255}
                  disabled={processing}
                />
                <InputError className="mt-1" message={errors.app_name} />
                <p className="text-sm text-muted-foreground">
                  This name appears in navigation and document titles.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button disabled={processing}>Save changes</Button>
                {recentlySuccessful && (
                  <span className="text-sm text-muted-foreground">
                    Saved
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

