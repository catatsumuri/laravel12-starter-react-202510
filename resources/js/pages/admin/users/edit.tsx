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

type UserResource = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
};

export default function EditUser({
  user,
  roles,
}: {
  user: UserResource;
  roles: RoleOption[];
}) {
  const { t } = useTranslation();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('admin.users.title'),
      href: AdminUserController.index.url(),
    },
    {
      title: user.name,
      href: AdminUserController.edit.url(user.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head
        title={t('admin.users.edit_user.head_title', { name: user.name })}
      />

      <div className="flex items-center justify-between">
        <Heading
          title={t('admin.users.edit_user.title', { name: user.name })}
          description={t('admin.users.edit_user.description')}
        />
        <Button asChild variant="outline">
          <Link href={AdminUserController.index.url()}>
            {t('common.back_to_users')}
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <Form
          {...AdminUserController.update.form(user.id)}
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
                    name="name"
                    defaultValue={user.name}
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
                    defaultValue={user.email}
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
                    name="password"
                    placeholder={t(
                      'admin.users.edit_user.password_placeholder',
                    )}
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
                    name="password_confirmation"
                    placeholder={t(
                      'admin.users.edit_user.confirm_password_placeholder',
                    )}
                  />
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

              <div className="grid gap-2 md:w-1/2">
                <Label htmlFor="role">{t('common.roles')}</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue={user.role ?? ''}
                  required
                  className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <option value="" disabled>
                    {t('admin.users.edit_user.role_placeholder')}
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
                  {t('admin.users.edit_user.submit')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={processing}
                >
                  <Link href={AdminUserController.index.url()}>
                    {t('admin.users.edit_user.cancel')}
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
