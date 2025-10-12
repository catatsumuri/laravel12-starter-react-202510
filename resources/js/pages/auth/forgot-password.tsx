// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword({ status }: { status?: string }) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.forgot_password.title')}
      description={t('auth.forgot_password.description')}
    >
      <Head title={t('auth.forgot_password.head_title')} />

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <div className="space-y-6">
        <Form {...PasswordResetLinkController.store.form()}>
          {({ processing, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('common.email_address')}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="off"
                  autoFocus
                  placeholder={t('common.email_placeholder')}
                />

                <InputError message={errors.email} />
              </div>

              <div className="my-6 flex items-center justify-start">
                <Button
                  className="w-full"
                  disabled={processing}
                  data-test="email-password-reset-link-button"
                >
                  {processing && (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  )}
                  {t('auth.forgot_password.submit')}
                </Button>
              </div>
            </>
          )}
        </Form>

        <div className="text-center text-sm text-muted-foreground">
          <span>{t('auth.forgot_password.return_prompt')}</span>{' '}
          <TextLink href={login()}>{t('auth.forgot_password.return_link')}</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
