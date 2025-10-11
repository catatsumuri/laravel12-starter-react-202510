import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Bell, Check, CheckCircle, Info, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Notification, type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
  read as markNotificationRead,
  readAll as markAllNotificationsRead,
  destroy as deleteNotification,
} from '@/routes/notifications';

export function NotificationsDropdown({
  buttonClassName,
}: {
  buttonClassName?: string;
}) {
  const page = usePage<SharedData>();
  const sharedNotifications = useMemo(() => {
    const data = page.props.notifications;

    if (!Array.isArray(data)) {
      return [];
    }

    return data as Notification[];
  }, [page.props.notifications]);

  const [notifications, setNotifications] =
    useState<Notification[]>(sharedNotifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNotifications(
      sharedNotifications.map((notification) => ({ ...notification })),
    );
  }, [sharedNotifications]);

  const unreadCount = notifications.filter((notification) => !notification.read)
    .length;

  const markAsRead = (id: string) => {
    const previous = notifications.map((notification) => ({ ...notification }));

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );

    router.visit(markNotificationRead(id), {
      preserveScroll: true,
      preserveState: true,
      onError: () => setNotifications(previous),
      onCancel: () => setNotifications(previous),
    });
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    const previous = notifications.map((notification) => ({ ...notification }));

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );

    router.visit(markAllNotificationsRead(), {
      preserveScroll: true,
      preserveState: true,
      onError: () => setNotifications(previous),
      onCancel: () => setNotifications(previous),
    });
  };

  const removeNotification = (id: string) => {
    const previous = notifications.map((notification) => ({ ...notification }));

    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );

    router.visit(deleteNotification(id), {
      preserveScroll: true,
      preserveState: true,
      onError: () => setNotifications(previous),
      onCancel: () => setNotifications(previous),
    });
  };

  const renderIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="size-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="size-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('relative size-8 shrink-0', buttonClassName)}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-50 w-[calc(100vw-2rem)] p-0 sm:w-[380px]"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="size-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                You have no notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative flex gap-3 px-4 py-3 transition-colors hover:bg-accent ${
                    !notification.read ? 'bg-accent/50' : ''
                  }`}
                >
                  <div className="mt-0.5">{renderIcon(notification.type)}</div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight text-foreground">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-destructive" />
                      )}
                    </div>
                    <p className="text-sm leading-snug text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
