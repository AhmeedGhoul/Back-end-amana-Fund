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
    roles: ['ADMIN']
  },
  {
    displayName: 'Account',
    iconName: 'wallet', // changed from 'account' to a more fitting icon
    route: '/admin/account',
  },
  {
    displayName: 'Contracts',
    iconName: 'file-text',
    route: '/contracts', // Corrected route
  },
  {
    displayName: 'Sinistres',
    iconName: 'alert-triangle',
    route: '/sinistres', // Corrected route
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
        route: '/police/person'
      },
      {
        displayName: 'Object',
        iconName: 'wallet',
        route: '/police/object'
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
    route: '/admin/agency',
  },
  {
    displayName: 'Audit',
    iconName: 'file-search', // changed from 'document' to a more fitting audit icon
    route: '/admin/audit',
    roles: ['AUDITOR']
  }

];
