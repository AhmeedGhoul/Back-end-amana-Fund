import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard', // corrected
    route: '/dashboard',
  },
  {
    navCap: 'Admin',
  },
  {
    displayName: 'Users',
    iconName: 'user', // valid
    route: '/admin/user',
  },
  {
    displayName: 'Account',
    iconName: 'wallet', // changed from 'account' to a more fitting icon
    route: '/admin/account',
  },
  {
    displayName: 'Contracts',
    iconName: 'file-text', // changed from 'contract' to a valid icon
    route: '/ui-components/lists',
  },
  {
    displayName: 'Credit Pools',
    iconName: 'receipt', // changed from 'credit' to valid financial icon
    route: '/ui-components/menu',
  },
  {
    displayName: 'Sinistres',
    iconName: 'alert-triangle', // changed from 'danger' to valid warning icon
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Agencies',
    iconName: 'building', // changed from 'agency' to valid organization icon
    route: '/ui-components/forms',
  },
  {
    displayName: 'Audit',
    iconName: 'file-search', // changed from 'document' to a more fitting audit icon
    route: '/admin/audit',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication/register',
  },
  {
    navCap: 'Extra',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'brand-dribbble',
    route: '/extra/sample-page',
  },
];
