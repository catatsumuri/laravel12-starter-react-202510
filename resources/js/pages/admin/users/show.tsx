import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import AdminUserDeleteDialog from '@/components/admin/user-delete-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : '—';

export default function ShowUser({
  user,
  canDelete,
}: {
  user: UserDetail;
  canDelete: boolean;
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: AdminUserController.index.url(),
    },
    {
      title: user.name,
      href: AdminUserController.show.url(user.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`User: ${user.name}`} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Heading
          title={user.name}
          description="Review user profile and account status"
        />
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={AdminUserController.index.url()}>Back to users</Link>
          </Button>

          <Button asChild>
            <Link href={AdminUserController.edit.url(user.id)}>Edit user</Link>
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
            confirmLabel="Delete user"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Profile
          </h3>
          <div className="grid gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Name</p>
              <p className="text-base font-medium text-foreground">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Email</p>
              <p className="text-base text-foreground">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Roles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">No roles assigned</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Account status
          </h3>
          <div className="grid gap-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Email verification
              </p>
              <p className="text-base text-foreground">
                {user.email_verified_at
                  ? `Verified (${formatDateTime(user.email_verified_at)})`
                  : 'Not verified'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Created at
              </p>
              <p className="text-base text-foreground">
                {formatDateTime(user.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Updated at
              </p>
              <p className="text-base text-foreground">
                {formatDateTime(user.updated_at)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                Account state
              </p>
              <p className="text-base text-foreground">
                {user.deleted_at
                  ? `Soft deleted (${formatDateTime(user.deleted_at)})`
                  : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
