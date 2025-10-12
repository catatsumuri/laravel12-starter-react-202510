import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import AdminUserDeleteDialog from '@/components/admin/user-delete-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type UserDetail = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export default function ShowUser({
  user,
  canDelete,
}: {
  user: UserDetail;
  canDelete: boolean;
}) {
  const { t } = useTranslation();
  const formatDateTime = useDateFormatter();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('admin.users.title'),
      href: AdminUserController.index.url(),
    },
    {
      title: user.name,
      href: AdminUserController.show.url(user.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.users.show.head_title', { name: user.name })} />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title={user.name}
            description={t('admin.users.show.description')}
          />
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={AdminUserController.index.url()}>
                {t('admin.users.show.back')}
              </Link>
            </Button>

            <Button asChild>
              <Link href={AdminUserController.edit.url(user.id)}>
                {t('admin.users.show.edit')}
              </Link>
            </Button>

            <AdminUserDeleteDialog
              userId={user.id}
              userName={user.name}
              disabled={!canDelete}
              triggerProps={{
                className: 'gap-2',
                size: 'default',
                'data-test': 'delete-user',
              }}
              confirmLabel={t('admin.users.show.delete')}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {t('admin.users.show.profile_heading')}
            </h3>
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.name_label')}
                </p>
                <p className="text-base font-medium text-foreground">
                  {user.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.email_label')}
                </p>
                <p className="text-base text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.roles_label')}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">
                      {t('admin.users.show.no_roles')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {t('admin.users.show.account_heading')}
            </h3>
            <div className="grid gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.email_verification_label')}
                </p>
                <p className="text-base text-foreground">
                  {user.email_verified_at
                    ? t('admin.users.show.verified', {
                        date: formatDateTime(user.email_verified_at),
                      })
                    : t('admin.users.show.not_verified')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.created_at_label')}
                </p>
                <p className="text-base text-foreground">
                  {formatDateTime(user.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.updated_at_label')}
                </p>
                <p className="text-base text-foreground">
                  {formatDateTime(user.updated_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  {t('admin.users.show.account_state_label')}
                </p>
                <p className="text-base text-foreground">
                  {user.deleted_at
                    ? t('admin.users.show.soft_deleted', {
                        date: formatDateTime(user.deleted_at),
                      })
                    : t('admin.users.show.active')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
