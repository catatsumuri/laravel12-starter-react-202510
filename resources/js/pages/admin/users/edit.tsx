import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

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
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: AdminUserController.index.url(),
    },
    {
      title: user.name,
      href: AdminUserController.edit.url(user.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${user.name}`} />

      <div className="flex items-center justify-between">
        <Heading
          title={`Edit ${user.name}`}
          description="Update account details or reset the password"
        />
        <Button asChild variant="outline">
          <Link href={AdminUserController.index.url()}>Back to users</Link>
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    name="name"
                    defaultValue={user.name}
                    placeholder="Full name"
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    name="email"
                    defaultValue={user.email}
                    placeholder="email@example.com"
                  />
                  <InputError message={errors.email} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep current password"
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    Confirm password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm new password"
                  />
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

              <div className="grid gap-2 md:w-1/2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue={user.role ?? ''}
                  required
                  className="h-10 rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="" disabled>
                    Select a role
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
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={processing}
                >
                  <Link href={AdminUserController.index.url()}>Cancel</Link>
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AppLayout>
  );
}
