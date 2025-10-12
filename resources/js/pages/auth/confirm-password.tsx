import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ConfirmPassword() {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.confirm_password.title')}
      description={t('auth.confirm_password.description')}
    >
      <Head title={t('auth.confirm_password.head_title')} />

      <Form {...store.form()} resetOnSuccess={['password']}>
        {({ processing, errors }) => (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder={t('common.password_placeholder')}
                autoComplete="current-password"
                autoFocus
              />

              <InputError message={errors.password} />
            </div>

            <div className="flex items-center">
              <Button
                className="w-full"
                disabled={processing}
                data-test="confirm-password-button"
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {t('auth.confirm_password.submit')}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
