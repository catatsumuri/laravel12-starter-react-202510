import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from 'react-i18next';

interface ResetPasswordProps {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.reset_password.title')}
      description={t('auth.reset_password.description')}
    >
      <Head title={t('auth.reset_password.head_title')} />

      <Form
        {...NewPasswordController.store.form()}
        transform={(data) => ({ ...data, token, email })}
        resetOnSuccess={['password', 'password_confirmation']}
      >
        {({ processing, errors }) => (
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                className="mt-1 block w-full"
                readOnly
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t('common.password')}</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="new-password"
                className="mt-1 block w-full"
                autoFocus
                placeholder={t('common.password_placeholder')}
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">
                {t('common.confirm_password')}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                className="mt-1 block w-full"
                placeholder={t('common.confirm_password_placeholder')}
              />
              <InputError
                message={errors.password_confirmation}
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={processing}
              data-test="reset-password-button"
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {t('auth.reset_password.submit')}
            </Button>
          </div>
        )}
      </Form>
    </AuthLayout>
  );
}
