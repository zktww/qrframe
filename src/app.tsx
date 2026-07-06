import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./app.css";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { ButtonGroup, ButtonGroupItem } from "./components/ButtonGroup";
import {
  I18nProvider,
  LANGUAGE_LABELS,
  LANGUAGES,
  useI18n,
  type Language,
} from "./lib/i18n";

export default function App() {
  return (
    <I18nProvider>
      <Router
        base={import.meta.env.SERVER_BASE_URL}
        root={(props) => <Suspense>{props.children}</Suspense>}
      >
        <FileRoutes />
      </Router>
      <Footer />
    </I18nProvider>
  );
}

function Footer() {
  const { language, setLanguage, t } = useI18n();

  return (
    <footer class="text-sm flex flex-wrap justify-center items-center gap-4 px-4 py-8">
      <a
        class="font-semibold hover:text-fore-base/80 focus-visible:(outline-none ring-2 ring-fore-base ring-offset-2 ring-offset-back-base)"
        href="./bugs"
        target="_blank"
      >
        {t().footer.bugs}
      </a>
      <a
        class="font-semibold hover:text-fore-base/80 focus-visible:(outline-none ring-2 ring-fore-base ring-offset-2 ring-offset-back-base)"
        href="https://github.com/zhengkyl/qrframe"
        target="_blank"
      >
        {t().footer.source}
      </a>
      <a
        class="font-semibold hover:text-fore-base/80 focus-visible:(outline-none ring-2 ring-fore-base ring-offset-2 ring-offset-back-base)"
        href="https://kylezhe.ng/posts/crafting_qr_codes"
        target="_blank"
      >
        {t().footer.blog}
      </a>
      <div class="flex items-center gap-2">
        <span class="text-fore-subtle">{t().footer.language}</span>
        <ButtonGroup
          value={language()}
          setValue={(lang) => setLanguage(lang as Language)}
        >
          {LANGUAGES.map((lang) => (
            <ButtonGroupItem value={lang}>
              {LANGUAGE_LABELS[lang]}
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      </div>
    </footer>
  );
}
