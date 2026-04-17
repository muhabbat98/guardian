import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}