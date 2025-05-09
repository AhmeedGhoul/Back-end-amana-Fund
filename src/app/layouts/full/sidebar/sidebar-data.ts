import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: '/dashboard'
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
    route: '/ui-components/lists',
  },
  {
    displayName: 'Policies',
    iconName: 'file-text',
    class: 'has-arrow',
    children: [
      {
        displayName: 'Policy Contract',
        iconName: 'file-text',
        route: '/admin/police'
      },
      {
        displayName: 'Statistics Dashboard',
        iconName: 'chart-bar',
        route: '/police/statistics'
      },
      {
        displayName: 'Person',
        iconName: 'user',
        route: '/person/list'
      },
      {
        displayName: 'Object',
        iconName: 'wallet',
        route: '/object'
      }
    ]
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
