import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package, 
  Briefcase, 
  Shield, 
  Settings, 
  ChevronDown 
} from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const [isMastersOpen, setIsMastersOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Workspace', href: '/workspace', icon: Briefcase },
  ];

  const mastersNavigation = [
    { name: 'Role Management', href: '/roles', icon: Shield },
    { name: 'User Roles', href: '/user-roles', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <nav className="bg-white shadow-sm w-64 fixed top-0 left-0 bottom-0 overflow-y-auto">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <Calendar className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">CalendarCRM</span>
        </div>
        <div className="py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } flex items-center px-4 py-2 text-sm font-medium`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
          <div className="relative">
            <button
              onClick={() => setIsMastersOpen(!isMastersOpen)}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="h-5 w-5 mr-3" />
              Masters
              <ChevronDown className={`ml-auto h-4 w-4 transform ${isMastersOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMastersOpen && (
              <div className="bg-gray-50">
                {mastersNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMastersOpen(false)}
                      className="flex items-center px-8 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="py-6 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}