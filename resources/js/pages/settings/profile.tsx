import ProfileAvatarController from '@/actions/App/Http/Controllers/Settings/ProfileAvatarController';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ImageUp, LoaderCircle, Trash2 } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { useTranslation } from 'react-i18next';

export default function Profile({
  mustVerifyEmail,
  status,
  avatar,
  canDeleteAccount,
}: {
  mustVerifyEmail: boolean;
  status?: string;
  avatar: string | null;
  canDeleteAccount?: boolean;
}) {
  const { auth, allowAccountDeletion, settingsNavigation } =
    usePage<SharedData>().props;
  const { t } = useTranslation();
  const currentAvatarUrl = avatar ?? null;
  const canDeleteAccountFeature =
    (canDeleteAccount ?? true) &&
    (allowAccountDeletion ?? true) &&
    (settingsNavigation?.deleteAccount ?? true);
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('settings.profile.breadcrumb'),
      href: edit().url,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('settings.profile.head_title')} />

      <SettingsLayout>
        <div className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <HeadingSmall
                title={t('settings.profile.avatar.title')}
                description={t('settings.profile.avatar.description')}
              />

              <Form
                {...ProfileAvatarController.store.form()}
                encType="multipart/form-data"
                options={{
                  preserveScroll: true,
                }}
                resetOnSuccess={['avatar']}
                className="space-y-6"
              >
                {({ processing, errors, progress, recentlySuccessful }) => (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">
                        {t('settings.profile.avatar.label')}
                      </Label>

                      <Input
                        id="avatar"
                        type="file"
                        name="avatar"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        aria-describedby="avatar-helper"
                      />

                      <p
                        id="avatar-helper"
                        className="text-sm text-muted-foreground"
                      >
                        {t('settings.profile.avatar.helper')}
                      </p>

                      <InputError className="mt-2" message={errors.avatar} />
                    </div>

                    {progress && progress.percentage !== null && (
                      <p className="text-sm text-muted-foreground">
                        {t('settings.profile.avatar.progress', {
                          percentage: Math.round(progress.percentage),
                        })}
                      </p>
                    )}

                    <Button type="submit" disabled={processing}>
                      {processing ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ImageUp className="mr-2 h-4 w-4" />
                      )}
                      {t('settings.profile.avatar.submit')}
                    </Button>

                    <Transition
                      show={recentlySuccessful}
                      enter="transition ease-in-out"
                      enterFrom="opacity-0"
                      leave="transition ease-in-out"
                      leaveTo="opacity-0"
                    >
                      <p className="text-sm text-neutral-600">
                        {t('settings.profile.avatar.success')}
                      </p>
                    </Transition>
                  </>
                )}
              </Form>
            </div>

            <div className="space-y-6 lg:pl-6">
              <HeadingSmall
                title={t('settings.profile.avatar.preview_title')}
                description={t('settings.profile.avatar.preview_description')}
              />

              <div className="flex flex-col items-center gap-4">
                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border bg-background shadow-sm">
                  {currentAvatarUrl ? (
                    <img
                      key={currentAvatarUrl}
                      src={currentAvatarUrl}
                      alt={t('settings.profile.avatar.current_alt')}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm text-muted-foreground">
                      {t('settings.profile.avatar.empty')}
                    </span>
                  )}
                </div>

                {currentAvatarUrl && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="inline-flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('settings.profile.avatar.remove_button')}
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogTitle>
                        {t('settings.profile.avatar.delete_title')}
                      </DialogTitle>
                      <DialogDescription>
                        {t('settings.profile.avatar.delete_description')}
                      </DialogDescription>

                      <Form
                        {...ProfileAvatarController.destroy.form()}
                        options={{
                          preserveScroll: true,
                        }}
                        resetOnSuccess
                      >
                        {({ processing }) => (
                          <DialogFooter className="mt-6 gap-2">
                            <DialogClose asChild>
                              <Button variant="secondary">
                                {t('common.cancel')}
                              </Button>
                            </DialogClose>

                            <Button
                              type="submit"
                              variant="destructive"
                              disabled={processing}
                              className="inline-flex items-center"
                            >
                              {(processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                              )) || <Trash2 className="mr-2 h-4 w-4" />}
                              {t('settings.profile.avatar.delete_confirm')}
                            </Button>
                          </DialogFooter>
                        )}
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <HeadingSmall
              title={t('settings.profile.title')}
              description={t('settings.profile.description')}
            />

            <Form
              {...ProfileController.update.form()}
              options={{
                preserveScroll: true,
              }}
              className="space-y-6"
            >
              {({ processing, recentlySuccessful, errors }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t('common.name')}</Label>

                    <Input
                      id="name"
                      className="mt-1 block w-full"
                      defaultValue={auth.user.name}
                      name="name"
                      required
                      autoComplete="name"
                      placeholder={t('common.full_name_placeholder')}
                    />

                    <InputError className="mt-2" message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">{t('common.email_address')}</Label>

                    <Input
                      id="email"
                      type="email"
                      className="mt-1 block w-full"
                      defaultValue={auth.user.email}
                      name="email"
                      required
                      autoComplete="username"
                      placeholder={t('common.email_placeholder')}
                    />

                    <InputError className="mt-2" message={errors.email} />
                  </div>

                  {mustVerifyEmail && auth.user.email_verified_at === null && (
                    <div>
                      <p className="-mt-4 text-sm text-muted-foreground">
                        {t('settings.profile.unverified_message')}{' '}
                        <Link
                          href={send()}
                          as="button"
                          className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                        >
                          {t('settings.profile.resend_link')}
                        </Link>
                      </p>

                      {status === 'verification-link-sent' && (
                        <div className="mt-2 text-sm font-medium text-green-600">
                          {t('settings.profile.verification_sent')}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      disabled={processing}
                      data-test="update-profile-button"
                    >
                      {t('settings.profile.save_button')}
                    </Button>

                    <Transition
                      show={recentlySuccessful}
                      enter="transition ease-in-out"
                      enterFrom="opacity-0"
                      leave="transition ease-in-out"
                      leaveTo="opacity-0"
                    >
                      <p className="text-sm text-neutral-600">
                        {t('settings.profile.saved_message')}
                      </p>
                    </Transition>
                  </div>
                </>
              )}
            </Form>
          </div>

          {canDeleteAccountFeature && <DeleteUser />}
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
