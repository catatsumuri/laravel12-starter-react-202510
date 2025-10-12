import ApplicationSettingController from '@/actions/App/Http/Controllers/Admin/ApplicationSettingController';
import AdminUserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Settings, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AppSidebar() {
  const { t } = useTranslation();
  const page = usePage<SharedData>();
  const roles = Array.isArray(page.props.auth?.user?.roles)
    ? page.props.auth.user.roles
    : [];
  const isAdmin = roles.some((role) =>
    typeof role === 'string' ? role === 'admin' : role?.name === 'admin',
  );
  const mainNavItems: NavItem[] = [
    {
      title: t('navigation.dashboard'),
      href: dashboard(),
      icon: LayoutGrid,
    },
  ];
  const adminFooterNavItems: NavItem[] = [
    {
      title: t('navigation.application_settings'),
      href: ApplicationSettingController.edit.url(),
      icon: Settings,
    },
    {
      title: t('navigation.user_management'),
      href: AdminUserController.index.url(),
      icon: Users,
    },
  ];
  const footerItems = isAdmin ? adminFooterNavItems : [];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        {footerItems.length > 0 && (
          <NavFooter items={footerItems} className="mt-auto" />
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
