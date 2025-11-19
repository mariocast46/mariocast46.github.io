// Server Component
import { getDictionary } from "../../lib/i18n";
import Providers from "../providers";
import ClientDictProvider from "./ClientDictProvider"; // el provider que exporta useT/useLang
import Header from "../../components/Header";
import RouteTransition from "../../components/RouteTransition";

export const dynamic = "force-static";

export default async function LocaleLayout({ children, params: { lang } }) {
  const dict = await getDictionary(lang);

  return (
    <Providers>
      <ClientDictProvider dict={dict} lang={lang}>
        <Header />
        {/* 👇 espaciador que reserva la altura del header */}
        <div className="olh-header-spacer" aria-hidden="true" />
        {/* Contenido con transiciones */}
        <main id="page-root">
          <RouteTransition>{children}</RouteTransition>
        </main>
      </ClientDictProvider>
    </Providers>
  );
}
