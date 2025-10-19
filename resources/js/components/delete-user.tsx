import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
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
import { type SharedData } from '@/types';
import { Form, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function DeleteUser() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { allowAccountDeletion, settingsNavigation } =
    usePage<SharedData>().props;

  const featureEnabled =
    (settingsNavigation?.deleteAccount ?? true) &&
    (allowAccountDeletion ?? true);

  if (!featureEnabled) {
    return null;
  }

  return (
    <div className="space-y-6">
      <HeadingSmall
        title={t('settings.profile.delete.title')}
        description={t('settings.profile.delete.description')}
      />
      <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">
            {t('settings.profile.delete.warning_title')}
          </p>
          <p className="text-sm">
            {t('settings.profile.delete.warning_description')}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" data-test="delete-user-button">
              {t('settings.profile.delete.trigger')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              {t('settings.profile.delete.dialog_title')}
            </DialogTitle>
            <DialogDescription>
              {t('settings.profile.delete.dialog_description')}
            </DialogDescription>

            <Form
              {...ProfileController.destroy.form()}
              options={{
                preserveScroll: true,
              }}
              onError={() => passwordInput.current?.focus()}
              resetOnSuccess
              className="space-y-6"
            >
              {({ resetAndClearErrors, processing, errors }) => (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="sr-only">
                      {t('common.password')}
                    </Label>

                    <Input
                      id="password"
                      type="password"
                      name="password"
                      ref={passwordInput}
                      placeholder={t(
                        'settings.profile.delete.password_placeholder',
                      )}
                      autoComplete="current-password"
                    />

                    <InputError message={errors.password} />
                  </div>

                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button
                        variant="secondary"
                        onClick={() => resetAndClearErrors()}
                      >
                        {t('settings.profile.delete.cancel')}
                      </Button>
                    </DialogClose>

                    <Button variant="destructive" disabled={processing} asChild>
                      <button
                        type="submit"
                        data-test="confirm-delete-user-button"
                      >
                        {t('settings.profile.delete.confirm')}
                      </button>
                    </Button>
                  </DialogFooter>
                </>
              )}
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
