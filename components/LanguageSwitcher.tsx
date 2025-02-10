'use client';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();

  return (
    <select 
      value={i18n.language}
      onChange={async (e) => {
        await i18n.changeLanguage(e.target.value);
        router.refresh(); // ⇦ Update server-rendered content
      }}
      className="bg-gray-800 text-sm text-white px-8 py-2 rounded"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="ja">日本語</option>
    </select>
  );
}
