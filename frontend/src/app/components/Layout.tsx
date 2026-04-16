import { Outlet, Link, useLocation } from 'react-router';
import { Home, Calendar, Users, Menu, X, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import logo from 'figma:asset/a0872c80c0190fe6764ce4ea81f9ee41dabf202e.png';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useData } from '../contexts/DataContext';

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { loading, error, refreshAll } = useData();

  const navigation = [
    { name: t.dashboard, path: '/', icon: Home },
    { name: t.activities, path: '/activities', icon: Calendar },
    { name: t.students, path: '/students', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">{t.appTitle}</h1>
                <p className="text-xs text-gray-500">{t.appSubtitle}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Loading bar */}
      {loading && (
        <div className="h-1 bg-blue-100">
          <div className="h-1 bg-blue-500 animate-pulse w-full" />
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Cannot reach server:</strong> {error}. Make sure the backend is running on port 3001.
              </span>
            </div>
            <button
              onClick={refreshAll}
              className="flex items-center gap-1 text-sm text-red-700 hover:text-red-900 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading && !error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm">Connecting to Guardian server…</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}