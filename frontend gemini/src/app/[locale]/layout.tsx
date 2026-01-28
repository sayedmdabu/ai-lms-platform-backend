import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
 
  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex h-screen flex-col">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
