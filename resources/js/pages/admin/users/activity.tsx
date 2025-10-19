import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useDateFormatter } from '@/hooks/use-date-formatter';
import { useRelativeTimeFormatter } from '@/hooks/use-relative-time';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type ActivityLogEntry = {
  id: number;
  description: string;
  causer?: {
    id: number;
    name: string;
  } | null;
  changes?: {
    attributes?: Record<string, unknown>;
    old?: Record<string, unknown>;
  };
  created_at?: string | null;
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type ActivityResponse = {
  data: ActivityLogEntry[];
  links: PaginationLink[];
};

export default function UserActivity({
  user,
  activities,
}: {
  user: { id: number; name: string };
  activities: ActivityResponse;
}) {
  const { t } = useTranslation();
  const formatDateTime = useDateFormatter();
  const formatRelativeTime = useRelativeTimeFormatter();
  const paginationLinks = activities.links ?? [];

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('admin.users.title'),
      href: AdminUserController.index.url(),
    },
    {
      title: user.name,
      href: AdminUserController.show.url(user.id),
    },
    {
      title: t('admin.users.activity.title'),
      href: AdminUserController.activity.url(user.id),
    },
  ];

  const renderChanges = (changes?: Record<string, unknown>) => {
    if (!changes || Object.keys(changes).length === 0) {
      return (
        <span className="text-sm text-muted-foreground">
          {t('admin.users.activity.changes_empty')}
        </span>
      );
    }

    return (
      <pre className="max-h-40 overflow-auto rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
        {JSON.stringify(changes, null, 2)}
      </pre>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('admin.users.activity.head_title', { name: user.name })} />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title={t('admin.users.activity.title')}
            description={t('admin.users.activity.description', {
              name: user.name,
            })}
          />
          <Button asChild variant="outline">
            <Link href={AdminUserController.show.url(user.id)}>
              {t('admin.users.activity.back')}
            </Link>
          </Button>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          {activities.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('admin.users.activity.empty')}
            </p>
          ) : (
            <ul className="space-y-4">
              {activities.data.map((activity) => {
                const causerName =
                  activity.causer?.name ?? t('admin.users.activity.system');
                const hasNewValues =
                  Object.keys(activity.changes?.attributes ?? {}).length > 0;
                const hasOldValues =
                  Object.keys(activity.changes?.old ?? {}).length > 0;

                return (
                  <li key={activity.id} className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {activity.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t('admin.users.activity.causer', {
                            name: causerName,
                          })}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground sm:text-right">
                        <p>{formatRelativeTime(activity.created_at)}</p>
                        <p className="text-xs">
                          {formatDateTime(activity.created_at)}
                        </p>
                      </div>
                    </div>

                    {(hasNewValues || hasOldValues) && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {hasOldValues && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">
                              {t('admin.users.activity.changes_old')}
                            </p>
                            {renderChanges(activity.changes?.old)}
                          </div>
                        )}

                        {hasNewValues && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">
                              {t('admin.users.activity.changes_new')}
                            </p>
                            {renderChanges(activity.changes?.attributes)}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
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
