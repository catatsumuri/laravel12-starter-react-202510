import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import AdminUserDeleteDialog from '@/components/admin/user-delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useRelativeTimeFormatter } from '@/hooks/use-relative-time';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type UserListItem = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  deleted_at?: string | null;
  last_login_at?: string | null;
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type UsersResponse = {
  data: UserListItem[];
  links: PaginationLink[];
};

export default function UsersIndex({ users }: { users: UsersResponse }) {
  const { t } = useTranslation();
  const formatDateTime = useDateFormatter();
  const formatRelativeTime = useRelativeTimeFormatter();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('admin.users.title'),
      href: AdminUserController.index.url(),
    },
  ];
  const { auth } = usePage<SharedData>().props;
  const paginationLinks = users.links ?? [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.users.title')} />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <div className="flex items-center justify-between">
          <Heading
            title={t('admin.users.title')}
            description={t('admin.users.description')}
          />
          <Button asChild>
            <Link
              href={AdminUserController.create.url()}
              className="inline-flex items-center gap-2"
            >
              <Plus className="size-4" />
              {t('admin.users.new_user')}
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t('common.name')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t('common.email')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t('common.roles')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {t('common.last_login')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    {t('admin.users.no_users')}
                  </td>
                </tr>
              ) : (
                users.data.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.roles.length > 0 ? user.roles.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.last_login_at ? (
                        <div className="flex flex-col">
                          <span className="text-foreground">
                            {formatRelativeTime(user.last_login_at)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(user.last_login_at)}
                          </span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Link
                            href={AdminUserController.show.url(user.id)}
                            data-test={`view-user-${user.id}`}
                          >
                            <Eye className="size-4" />
                            {t('admin.users.view')}
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Link
                            href={AdminUserController.edit.url(user.id)}
                            data-test={`edit-user-${user.id}`}
                          >
                            <Pencil className="size-4" />
                            {t('admin.users.edit')}
                          </Link>
                        </Button>

                        <AdminUserDeleteDialog
                          userId={user.id}
                          userName={user.name}
                          disabled={auth.user.id === user.id}
                          triggerProps={{
                            size: 'sm',
                            className: 'gap-2',
                            'data-test': `delete-user-${user.id}`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {paginationLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {paginationLinks.map((link, index) => (
              <Button
                key={`${link.label}-${index}`}
                asChild={!!link.url}
                variant={link.active ? 'default' : 'outline'}
                size="sm"
                className={link.active ? 'pointer-events-none' : undefined}
              >
                {link.url ? (
                  <Link
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: link.label }} />
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
