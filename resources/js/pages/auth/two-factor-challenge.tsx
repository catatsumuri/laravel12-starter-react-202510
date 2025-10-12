import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TwoFactorChallenge() {
  const { t } = useTranslation();
  const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const authConfigContent = useMemo<{
    title: string;
    description: string;
    toggleText: string;
  }>(() => {
    if (showRecoveryInput) {
      return {
        title: t('auth.two_factor.recovery_title'),
        description: t('auth.two_factor.recovery_description'),
        toggleText: t('auth.two_factor.recovery_toggle_text'),
      };
    }

    return {
      title: t('auth.two_factor.auth_title'),
      description: t('auth.two_factor.auth_description'),
      toggleText: t('auth.two_factor.auth_toggle_text'),
    };
  }, [showRecoveryInput, t]);

  const toggleRecoveryMode = (clearErrors: () => void): void => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode('');
  };

  return (
    <AuthLayout
      title={authConfigContent.title}
      description={authConfigContent.description}
    >
      <Head title={t('auth.two_factor.head_title')} />

      <div className="space-y-6">
        <Form
          {...store.form()}
          className="space-y-4"
          resetOnError
          resetOnSuccess={!showRecoveryInput}
        >
          {({ errors, processing, clearErrors }) => (
            <>
              {showRecoveryInput ? (
                <>
                  <Input
                    name="recovery_code"
                    type="text"
                    placeholder={t('common.recovery_code_placeholder')}
                    autoFocus={showRecoveryInput}
                    required
                  />
                  <InputError message={errors.recovery_code} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="flex w-full items-center justify-center">
                    <InputOTP
                      name="code"
                      maxLength={OTP_MAX_LENGTH}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={processing}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <InputError message={errors.code} />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={processing}>
                {t('auth.two_factor.continue')}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <span>{t('auth.two_factor.toggle_prefix')} </span>
                <button
                  type="button"
                  className="cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                  onClick={() => toggleRecoveryMode(clearErrors)}
                >
                  {authConfigContent.toggleText}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AuthLayout>
  );
}
