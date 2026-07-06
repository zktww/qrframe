import AtSign from "lucide-solid/icons/at-sign";
import { useI18n } from "~/lib/i18n";

export default function Bugs() {
  const { t } = useI18n();

  return (
    <main class="max-w-screen-sm mx-auto">
      <div class="px-4 py-8 flex flex-col gap-4">
        <p>
          {t().bugs.githubPrefix}{" "}
          <a
            class="text-rose-500 font-semibold hover:text-rose-400 focus-visible:(outline-none ring-2 ring-fore-base ring-offset-2 ring-offset-back-base)"
            href="https://github.com/zhengkyl/qrframe/issues"
            target="_blank"
          >
            {t().bugs.githubIssue}
          </a>
          {t().bugs.githubSuffix}
        </p>
        <p>
          {t().bugs.emailPrefix}
          <AtSign class="inline h-4 w-4" />
          kylezhe.ng
        </p>
      </div>
    </main>
  );
}
