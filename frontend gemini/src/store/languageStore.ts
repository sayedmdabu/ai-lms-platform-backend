import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'bn' | 'es'; // ভবিষ্যতে আরও ভাষা যোগ করতে চাইলে এখানে 'es' বা অন্য কোড দিন

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // ডিফল্ট ভাষা
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'language-storage', // ব্রাউজারে সেভ থাকবে
    }
  )
);