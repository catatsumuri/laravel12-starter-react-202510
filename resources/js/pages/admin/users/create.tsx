import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type RoleOption = {
  id: number;
  name: string;
};

export default function CreateUser({ roles }: { roles: RoleOption[] }) {
  const { t } = useTranslation();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('admin.users.title'),
      href: AdminUserController.index.url(),
    },
    {
      title: t('admin.users.create.title'),
      href: AdminUserController.create.url(),
    },
  ];
  const defaultRole = roles[0]?.name ?? '';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.users.create.head_title')} />

      <div className="flex items-center justify-between">
        <Heading
          title={t('admin.users.create.title')}
          description={t('admin.users.create.description')}
        />
        <Button asChild variant="outline">
          <Link href={AdminUserController.index.url()}>
            {t('common.back_to_users')}
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <Form
          {...AdminUserController.store.form()}
          resetOnSuccess={['password', 'password_confirmation']}
          disableWhileProcessing
          className="space-y-6"
        >
          {({ processing, errors }) => (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('common.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    name="name"
                    placeholder={t('common.full_name_placeholder')}
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">{t('common.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    name="email"
                    placeholder={t('common.email_placeholder')}
                  />
                  <InputError message={errors.email} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('common.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                    placeholder={t('common.password_placeholder')}
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    {t('common.confirm_password')}
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    required
                    name="password_confirmation"
                    placeholder={t('common.confirm_password_placeholder')}
                  />
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

              <div className="grid gap-2 md:w-1/2">
                <Label htmlFor="role">{t('common.roles')}</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue={defaultRole}
                  required
                  className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <option value="" disabled>
                    {t('admin.users.create.role_placeholder')}
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <InputError message={errors.role} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                  {t('admin.users.create.submit')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={processing}
                >
                  <Link href={AdminUserController.index.url()}>
                    {t('admin.users.create.cancel')}
                  </Link>
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AppLayout>
  );
}
