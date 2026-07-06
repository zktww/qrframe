import { AlertDialog } from "@kobalte/core/alert-dialog";
import X from "lucide-solid/icons/x";
import { useI18n } from "~/lib/i18n";
import { FillButton, FlatButton } from "../Button";

type Props = {
  open: boolean;
  setClosed: () => void;
  onAllow: () => void;
};

export function AllowPasteDialog(props: Props) {
  const { t } = useI18n();

  return (
    <AlertDialog open={props.open} onOpenChange={props.setClosed}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay class="fixed inset-0 z-10 bg-black/20" />
        <div class="fixed inset-0 z-10 flex justify-center items-center">
          <AlertDialog.Content class="border rounded-md p-4 m-4 min-w-[min(calc(100vw-16px),400px)] max-w-[600px] bg-back-base">
            <div class="flex justify-between items-center -mt-2 -mr-2">
              <AlertDialog.Title class="text-lg font-semibold">
                {t().pasteDialog.title}
              </AlertDialog.Title>
              <AlertDialog.CloseButton class="p-2">
                <X />
              </AlertDialog.CloseButton>
            </div>
            <div class="flex flex-col gap-2 mb-4 text-sm">
              <p>{t().pasteDialog.warning}</p>
              <p>{t().pasteDialog.details}</p>
              <p>{t().pasteDialog.deleteHint}</p>
              <p>{t().pasteDialog.acceptQuestion}</p>
            </div>
            <div class="flex justify-end gap-2">
              <FillButton
                onMouseDown={() => {
                  props.onAllow();
                  props.setClosed();
                }}
              >
                {t().pasteDialog.yes}
              </FillButton>
              <FlatButton onMouseDown={props.setClosed}>
                {t().pasteDialog.no}
              </FlatButton>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
