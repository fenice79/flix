import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SearchModal from './SearchModal';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-red-600 text-3xl font-bold">ProtoFlix</Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link 
                    to="/" 
                    className={`px-3 py-2 ${location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/series" 
                    className={`px-3 py-2 ${location.pathname === '/series' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Serie TV
                  </Link>
                  <Link 
                    to="/movies" 
                    className={`px-3 py-2 ${location.pathname === '/movies' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Film
                  </Link>
                  <Link 
                    to="/new-and-popular" 
                    className={`px-3 py-2 ${location.pathname === '/new-and-popular' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Nuovi e Popolari
                  </Link>
                  <Link 
                    to="/live" 
                    className={`px-3 py-2 ${location.pathname === '/live' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Live
                  </Link>
                  <Link 
                    to="/my-list" 
                    className={`px-3 py-2 ${location.pathname === '/my-list' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    La mia lista
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(true)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                <Search className="h-6 w-6" />
              </button>
              <NotificationBell />
              <div 
                className="relative"
                ref={userMenuRef}
              >
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-300 hover:text-white focus:outline-none"
                >
                  <User className="h-6 w-6" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-900 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        {user?.name}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Esci
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal 
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </>
  );
}