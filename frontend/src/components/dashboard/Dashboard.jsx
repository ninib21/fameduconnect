/*
 * Dashboard Component for FamEduConnect
 * Note: Using ChatBubbleLeftIcon instead of ChatBubbleLeftRightIcon 
 * because ChatBubbleLeftRightIcon doesn't exist in Heroicons v2
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HomeIcon, 
  ChatBubbleLeftIcon, 
  AcademicCapIcon,
  CalendarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { USER_ROLES } from '../../utils/constants';
import MessagesPage from '../../pages/messages/MessagesPage';
import GradesPage from '../../pages/grades/GradesPage';
import { MessageProvider } from '../../contexts/MessageContext';

const Dashboard = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'overview', name: t('dashboard.overview'), icon: HomeIcon },
      { id: 'messages', name: t('navigation.messages'), icon: ChatBubbleLeftIcon },
      { id: 'calendar', name: t('navigation.calendar'), icon: CalendarIcon },
      { id: 'profile', name: t('navigation.profile'), icon: UserIcon },
    ];

    if (user.role === USER_ROLES.PARENT) {
      baseItems.splice(2, 0, { id: 'grades', name: t('navigation.grades'), icon: AcademicCapIcon });
    } else if (user.role === USER_ROLES.TEACHER) {
      baseItems.splice(2, 0, 
        { id: 'students', name: t('navigation.students'), icon: AcademicCapIcon },
        { id: 'grades', name: t('navigation.grades'), icon: AcademicCapIcon }
      );
    } else if (user.role === USER_ROLES.ADMIN) {
      baseItems.splice(2, 0,
        { id: 'students', name: t('navigation.students'), icon: AcademicCapIcon },
        { id: 'classes', name: t('navigation.classes'), icon: AcademicCapIcon },
        { id: 'reports', name: t('navigation.reports'), icon: AcademicCapIcon }
      );
    }

    baseItems.push({ id: 'settings', name: t('navigation.settings'), icon: Cog6ToothIcon });
    return baseItems;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.PARENT: return 'bg-blue-100 text-blue-800';
      case USER_ROLES.TEACHER: return 'bg-green-100 text-green-800';
      case USER_ROLES.ADMIN: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <MessageProvider user={user}>
      <div className="h-screen flex bg-gray-50">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent 
              navigationItems={navigationItems} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              user={user}
              onLogout={onLogout}
              getRoleColor={getRoleColor}
            />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <SidebarContent 
            navigationItems={navigationItems} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            user={user}
            onLogout={onLogout}
            getRoleColor={getRoleColor}
          />
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white shadow">
            <button
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {t('dashboard.welcome', { name: user.name })}
                  </h1>
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <BellIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <DashboardContent activeTab={activeTab} user={user} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </MessageProvider>
  );
};

const SidebarContent = ({ navigationItems, activeTab, setActiveTab, user, onLogout, getRoleColor }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-900">FamEduConnect</span>
        </div>
        
        <div className="mt-8 px-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                  {t(`auth.${user.role}`)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${
                activeTab === item.id
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group w-full flex items-center pl-2 pr-2 py-2 border-l-4 text-sm font-medium rounded-r-md transition-colors duration-150`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <button
          onClick={onLogout}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
          {t('common.logout')}
        </button>
      </div>
    </div>
  );
};

const DashboardContent = ({ activeTab, user }) => {
  const { t } = useTranslation();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {t('navigation.messages')}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">3 new</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {t('dashboard.upcomingEvents')}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">2 today</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {user.role === 'parent' ? 'Children' : user.role === 'teacher' ? 'Students' : 'Total Users'}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {user.role === 'parent' ? '2' : user.role === 'teacher' ? '24' : '156'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {t('dashboard.recentActivity')}
                  </h3>
                  <div className="mt-5">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        <li>
                          <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                                  <ChatBubbleLeftIcon className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    New message from {user.role === 'parent' ? 'Ms. Johnson' : 'Parent Smith'}
                                    <span className="ml-1 text-xs text-gray-400">2 hours ago</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'messages':
        return <MessagesPage user={user} />;
      case 'grades':
        return <GradesPage user={user} />;
      default:
        return (
          <div className="mt-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 capitalize">{activeTab}</h3>
            <p className="mt-2 text-gray-600">This section is coming soon!</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default Dashboard;