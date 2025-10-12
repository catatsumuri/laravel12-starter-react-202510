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
import { useTranslation } from 'react-i18next';

type TriggerButtonProps = ComponentProps<typeof Button> & {
  'data-test'?: string;
};

interface AdminUserDeleteDialogProps {
  userId: number;
  userName: string;
  disabled?: boolean;
  triggerProps?: TriggerButtonProps;
  confirmLabel?: string;
}

export default function AdminUserDeleteDialog({
  userId,
  userName,
  disabled = false,
  triggerProps,
  confirmLabel,
}: AdminUserDeleteDialogProps) {
  const { t } = useTranslation();
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
        {t('admin.users.delete.trigger')}
      </>
    );

  const resolvedConfirmLabel =
    confirmLabel ?? t('admin.users.delete.confirm_label');

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
          {t('admin.users.delete.title', { name: userName, id: userId })}
        </DialogTitle>
        <DialogDescription>
          {t('admin.users.delete.description', { name: userName, id: userId })}
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
                <Button variant="secondary">{t('common.cancel')}</Button>
              </DialogClose>

              <Button variant="destructive" disabled={processing} asChild>
                <button
                  type="submit"
                  data-test={`confirm-delete-user-${userId}`}
                >
                  {resolvedConfirmLabel}
                </button>
              </Button>
            </DialogFooter>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
