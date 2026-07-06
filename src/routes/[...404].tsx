import { A } from "@solidjs/router";
import { useI18n } from "~/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        {t().notFound.title}
      </h1>
      <A href="/" class="text-sky-600 hover:underline">
        {t().notFound.home}
      </A>
    </main>
  );
}
