import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    navCap: 'Admin',
  },
  {
    displayName: 'Users',
    iconName: 'user',
    route: '/admin/user',
  },
  {
    displayName: 'Accounts',
    iconName: 'wallet',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Contracts',
    iconName: 'file-text',
    route: '/contracts', // Corrected route
  },
  {
    displayName: 'Credit Pools',
    iconName: 'receipt',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Sinistres',
    iconName: 'alert-triangle',
    route: '/sinistres', // Corrected route
  },
  {
    displayName: 'Agencies',
    iconName: 'building',
    route: '/agencies', // Corrected route
  },
  {
    displayName: 'Audit',
    iconName: 'file-search',
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
