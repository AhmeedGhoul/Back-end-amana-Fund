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
    roles: ['ADMIN','AGENT']
  },
  {
    displayName: 'Contracts',
    iconName: 'file-text',
    route: '/contracts', // Corrected route
    roles: ['ADMIN','AGENT']
  },
  {
    displayName: 'Sinistres',
    iconName: 'alert-triangle',
    route: '/sinistres', // Corrected route
    roles: ['ADMIN']
  },
  {
    displayName: 'Policies',
    iconName: 'file-text',
    class: 'has-arrow',
    roles: ['ADMIN'],
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
    displayName: 'Contracts',
    iconName: 'file-text', // changed from 'contract' to a valid icon
    route: '/admin/contract',
  },
  {
    displayName: 'Payments',
    iconName: 'file-text', // changed from 'contract' to a valid icon
    route: '/admin/payment',
  },

  {
    displayName: 'Credit Pools',
    iconName: 'receipt', // changed from 'credit' to valid financial icon
    route: '/admin/credit-pool',
  },
  {
    displayName: 'Agencies',
    iconName: 'building', // changed from 'agency' to valid organization icon
    route: '/admin/agency',
    roles: ['ADMIN','AGENT']
  },
  {
    displayName: 'Audit',
    iconName: 'file-search', // changed from 'document' to a more fitting audit icon
    route: '/admin/audit',
    roles: ['AUDITOR']
  }

];
