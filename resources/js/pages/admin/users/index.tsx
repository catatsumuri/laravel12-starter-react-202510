import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import AdminUserDeleteDialog from '@/components/admin/user-delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus } from 'lucide-react';

type UserListItem = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  deleted_at?: string | null;
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: AdminUserController.index.url(),
  },
];

export default function UsersIndex({ users }: { users: UsersResponse }) {
  const { auth } = usePage<SharedData>().props;
  const paginationLinks = users.links ?? [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />

      <div className="flex items-center justify-between">
        <Heading
          title="Users"
          description="Manage application user accounts"
        />
        <Button asChild>
          <Link href={AdminUserController.create.url()} className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            New user
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Roles
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-muted-foreground"
                >
                  No users found.
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
                          View
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
                          Edit
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
        <div className="mt-6 flex flex-wrap gap-2">
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
    </AppLayout>
  );
}
