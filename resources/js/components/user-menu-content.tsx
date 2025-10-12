import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import LocaleController from '@/actions/App/Http/Controllers/LocaleController';
import { type SharedData, type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Check, LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const { t } = useTranslation();
  const cleanup = useMobileNavigation();
  const { locale, availableLocales } = usePage<SharedData>().props;

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  const handleLocaleChange = (value: string) => {
    if (value === locale) {
      cleanup();

      return;
    }

    router.post(
      LocaleController.update.url(),
      { locale: value },
      {
        preserveScroll: true,
        preserveState: true,
        onFinish: cleanup,
      },
    );
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            href={edit()}
            as="button"
            prefetch
            onClick={cleanup}
          >
            <Settings className="mr-2" />
            {t('auth.user_menu.settings')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {availableLocales && availableLocales.length > 0 && (
        <>
          <DropdownMenuLabel>{t('auth.user_menu.language_label')}</DropdownMenuLabel>
          {availableLocales.map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleLocaleChange(value)}
              disabled={locale === value}
            >
              {locale === value ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <span className="mr-2 h-4 w-4" />
              )}
              {t(`locales.${value}`)}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem asChild>
        <Link
          className="block w-full"
          href={logout()}
          as="button"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut className="mr-2" />
          {t('auth.user_menu.logout')}
        </Link>
      </DropdownMenuItem>
    </>
  );
}
