// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail({ status }: { status?: string }) {
  const { t } = useTranslation();

  return (
    <AuthLayout
      title={t('auth.verify_email.title')}
      description={t('auth.verify_email.description')}
    >
      <Head title={t('auth.verify_email.head_title')} />

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {t('auth.verify_email.status')}
        </div>
      )}

      <Form
        {...EmailVerificationNotificationController.store.form()}
        className="space-y-6 text-center"
      >
        {({ processing }) => (
          <>
            <Button disabled={processing} variant="secondary">
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {t('auth.verify_email.resend')}
            </Button>

            <TextLink href={logout()} className="mx-auto block text-sm">
              {t('auth.verify_email.logout')}
            </TextLink>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}
