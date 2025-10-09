import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Form } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { Trash } from 'lucide-react';

interface AdminUserDeleteDialogProps {
  userId: number;
  userName: string;
  disabled?: boolean;
  triggerProps?: ComponentProps<typeof Button>;
  confirmLabel?: string;
}

export default function AdminUserDeleteDialog({
  userId,
  userName,
  disabled = false,
  triggerProps,
  confirmLabel = 'Delete user',
}: AdminUserDeleteDialogProps) {
  const {
    children,
    className,
    variant,
    size,
    ...restTriggerProps
  } = triggerProps ?? {};

  const triggerContent =
    children ??
    (
      <>
        <Trash className="size-4" />
        Delete
      </>
    );

  const composedClassName = cn('gap-2', className);

  if (disabled) {
    return (
      <Button
        variant={variant ?? 'destructive'}
        size={size ?? 'sm'}
        className={composedClassName}
        disabled
        {...restTriggerProps}
      >
        {triggerContent}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant ?? 'destructive'}
          size={size ?? 'sm'}
          className={composedClassName}
          {...restTriggerProps}
        >
          {triggerContent}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Delete {userName} (ID: {userId})?
        </DialogTitle>
        <DialogDescription>
          This action will permanently remove {userName}&apos;s account (ID: {userId}) and revoke
          their ability to sign in. This cannot be undone.
        </DialogDescription>

        <Form
          {...AdminUserController.destroy.form(userId)}
          options={{
            preserveScroll: true,
          }}
        >
          {({ processing }) => (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>

              <Button variant="destructive" disabled={processing} asChild>
                <button
                  type="submit"
                  data-test={`confirm-delete-user-${userId}`}
                >
                  {confirmLabel}
                </button>
              </Button>
            </DialogFooter>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
