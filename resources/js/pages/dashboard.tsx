import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('common.dashboard'),
      href: dashboard().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('common.dashboard')} />
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {t('dashboard.highlights.heading')}
          </h2>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {[
              {
                title: t('dashboard.highlights.performance.title'),
                description: t('dashboard.highlights.performance.description'),
              },
              {
                title: t('dashboard.highlights.adoption.title'),
                description: t('dashboard.highlights.adoption.description'),
              },
              {
                title: t('dashboard.highlights.support.title'),
                description: t('dashboard.highlights.support.description'),
              },
            ].map((card) => (
              <section
                key={card.title}
                className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </section>
            ))}
          </div>
        </section>
        <section className="flex min-h-[440px] flex-1 flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {t('dashboard.insights.heading')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t('dashboard.insights.description')}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: t('dashboard.insights.roadmap.title'),
                description: t('dashboard.insights.roadmap.description'),
              },
              {
                title: t('dashboard.insights.revenue.title'),
                description: t('dashboard.insights.revenue.description'),
              },
              {
                title: t('dashboard.insights.retention.title'),
                description: t('dashboard.insights.retention.description'),
              },
              {
                title: t('dashboard.insights.team.title'),
                description: t('dashboard.insights.team.description'),
              },
            ].map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-2 rounded-lg border border-border/80 bg-background/80 p-4 dark:bg-muted/30"
              >
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
          <div className="rounded-lg border border-dashed border-border/80 bg-background/80 p-4 text-sm dark:bg-muted/30">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {t('dashboard.insights.cta.title')}
            </h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {t('dashboard.insights.cta.description')}
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
