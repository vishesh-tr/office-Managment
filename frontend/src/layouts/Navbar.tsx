import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiHome4Line, RiInboxLine, RiProjectorLine, RiTeamLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface NavbarItem {
  icon: React.ElementType;
  label: string;
  route: string;
  isActive?: boolean;
  badge?: number;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  
  // Get unread notifications count from inbox state
  const { notifications } = useSelector((state: RootState) => state.inbox);
  const unreadCount = notifications.filter(notification => !notification.read).length;

  const navItems: NavbarItem[] = [
    {
      icon: RiHome4Line,
      label: 'Home',
      route: '/',
      isActive: pathname === '/'
    },
    {
      icon: RiProjectorLine,
      label: 'Projects',
      route: '/dashboard',
      isActive: pathname === '/dashboard'
    },
    {
      icon: RiInboxLine,
      label: 'Inbox',
      route: '/inbox',
      isActive: pathname === '/inbox',
      badge: unreadCount
    },
    {
      icon: RiTeamLine,
      label: 'Team',
      route: '/team',
      isActive: pathname === '/team'
    }
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`
                  flex items-center gap-1 relative
                  ${item.isActive 
                    ? 'text-blue-600 font-medium border-b-2 border-blue-500 pb-0.5' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="text-lg" /> {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;