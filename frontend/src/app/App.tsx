import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </LanguageProvider>
  );
}