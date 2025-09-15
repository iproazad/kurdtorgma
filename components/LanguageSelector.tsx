
import React from 'react';
import { useLanguage, languages } from '../contexts/LanguageContext.tsx';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-2 end-2 z-10">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as keyof typeof languages)}
        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
        aria-label="Select language"
      >
        {Object.entries(languages).map(([code, { nativeName }]) => (
          <option key={code} value={code}>
            {nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
