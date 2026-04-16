import { Link } from 'react-router';
import { Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t.pageNotFound}</h2>
        <p className="text-gray-600 mb-8">
          {t.pageNotFoundMessage}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>{t.backToDashboard}</span>
        </Link>
      </div>
    </div>
  );
}