import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiHome4Line, RiInboxLine, RiProjectorLine, RiTeamLine } from 'react-icons/ri';

interface NavbarItem {
  icon: React.ElementType;
  label: string;
  route: string;
  isActive?: boolean;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const pathname = window.location.pathname;

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
      isActive: pathname === '/inbox'
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
                  flex items-center gap-1 
                  ${item.isActive 
                    ? 'text-blue-600 font-medium border-b-2 border-blue-500 pb-0.5' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="text-lg" /> {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;