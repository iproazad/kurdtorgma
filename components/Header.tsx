
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';

const Header: React.FC = () => {
  const { t } = useLanguage();
  return (
    <header className="text-center pt-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        {t('app.title')}
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        {t('app.description')}
      </p>
    </header>
  );
};

export default Header;
