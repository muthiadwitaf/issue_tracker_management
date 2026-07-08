import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const lightTheme = {
  dark: false,
  colors: {
    background: '#F2F4F7',
    surface: '#FFFFFF',
    primary: '#1E3A5F',
    'primary-darken-1': '#152A45',
    secondary: '#5C6B7A',
    accent: '#0F6CBD',
    error: '#C62828',
    info: '#2563EB',
    success: '#0F7B6C',
    warning: '#B45309',
    'on-surface': '#1F2937',
    statusOpen: '#C62828',
    statusInProgress: '#B45309',
    statusResolved: '#0F6CBD',
    statusTesting: '#6D28D9',
    statusDeploy: '#0E7490',
    statusTested: '#15803D',
    statusReviewed: '#A21CAF',
    statusClosed: '#5C6B7A',
    priorityLow: '#5C6B7A',
    priorityMedium: '#2563EB',
    priorityHigh: '#B45309',
    priorityCritical: '#C62828',
  },
  variables: {
    'border-color': '#D9DEE4',
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: '#0F1720',
    surface: '#182230',
    primary: '#5B8DEF',
    'primary-darken-1': '#3E6FD1',
    secondary: '#94A3B8',
    accent: '#38BDF8',
    error: '#EF5350',
    info: '#60A5FA',
    success: '#34D399',
    warning: '#FBBF24',
    'on-surface': '#E5E9F0',
    statusOpen: '#EF5350',
    statusInProgress: '#FBBF24',
    statusResolved: '#60A5FA',
    statusTesting: '#A78BFA',
    statusDeploy: '#22D3EE',
    statusTested: '#4ADE80',
    statusReviewed: '#F472B6',
    statusClosed: '#94A3B8',
    priorityLow: '#94A3B8',
    priorityMedium: '#60A5FA',
    priorityHigh: '#FBBF24',
    priorityCritical: '#EF5350',
  },
  variables: {
    'border-color': '#2A3644',
  },
};

const storedTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VCard: { rounded: 'lg' },
    VBtn: { rounded: 'lg' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VTextarea: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
  },
  theme: {
    defaultTheme: storedTheme,
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
});
