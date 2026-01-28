import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'bn'];

export default getRequestConfig(async ({ requestLocale }) => {
  // ১. ভাষা লোড করা (Promise থেকে)
  let locale = await requestLocale;

  // ২. ভ্যালিডেশন: যদি ভাষা না থাকে বা ভুল থাকে, তবে 'en'
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  return {
    // ✅ এই 'locale' লাইনটিই আপনার মিসিং ছিল, যার কারণে এরর হচ্ছিল
    locale, 
    // ৩. মেসেজ ফাইল লোড করা
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});