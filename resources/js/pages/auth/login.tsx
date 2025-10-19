import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const allowRegistration =
    usePage<{ allowRegistration?: boolean }>().props.allowRegistration ?? false;
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout
      title={t('auth.login.title')}
      description={t('auth.login.description')}
    >
      <Head title={t('auth.login.head_title')} />

      <Form
        {...AuthenticatedSessionController.store.form()}
        resetOnSuccess={['password']}
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('common.email_address')}</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  placeholder={t('common.email_placeholder')}
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('common.password')}</Label>
                  {canResetPassword && (
                    <TextLink
                      href={request()}
                      className="ml-auto text-sm"
                      tabIndex={5}
                    >
                      {t('auth.login.forgot_password')}
                    </TextLink>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    tabIndex={2}
                    autoComplete="current-password"
                    placeholder={t('common.password_placeholder')}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showPassword
                        ? t('auth.login.password_hide')
                        : t('auth.login.password_show')
                    }
                    tabIndex={6}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" name="remember" tabIndex={3} />
                <Label htmlFor="remember">{t('common.remember_me')}</Label>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                tabIndex={4}
                disabled={processing}
                data-test="login-button"
              >
                {processing && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {t('auth.login.submit')}
              </Button>
            </div>

            {allowRegistration && (
              <div className="text-center text-sm text-muted-foreground">
                {t('auth.login.no_account')}{' '}
                <TextLink href={register()} tabIndex={5}>
                  {t('auth.login.sign_up')}
                </TextLink>
              </div>
            )}
          </>
        )}
      </Form>

      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}
    </AuthLayout>
  );
}
