// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// User Roles
export const USER_ROLES = {
  PARENT: 'parent',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  MESSAGES: '/messages',
  GRADES: '/grades',
  SETTINGS: '/settings'
};

// Supported Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];