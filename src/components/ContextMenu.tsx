import { ContextMenu } from "@kobalte/core/context-menu";
import { type JSX } from "solid-js";
import { useI18n } from "~/lib/i18n";

type Props = {
  children: JSX.Element;
  onRename: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

export function ContextMenuProvider(props: Props) {
  const { t } = useI18n();

  return (
    <ContextMenu>
      {props.children}
      <ContextMenu.Portal>
        <ContextMenu.Content
          classList={{
            "leading-tight bg-back-base rounded-md border p-1": true,
            "cursor-not-allowed": props.disabled,
          }}
        >
          <ContextMenu.Item
            classList={{
              "p-2 rounded select-none data-[highlighted]:(bg-fore-base/10 outline-none)":
                true,
              "pointer-events-none opacity-50": props.disabled,
            }}
            onClick={props.onRename}
            disabled={props.disabled}
          >
            {t().contextMenu.rename}
          </ContextMenu.Item>
          <ContextMenu.Item
            classList={{
              "p-2 rounded select-none data-[highlighted]:(bg-fore-base/10 outline-none)":
                true,
              "pointer-events-none opacity-50": props.disabled,
            }}
            onClick={props.onDelete}
            disabled={props.disabled}
          >
            {t().contextMenu.delete}
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  );
}

type TriggerProps = {
  children: JSX.Element;
};

export function ContentMenuTrigger(props: TriggerProps) {
  return <ContextMenu.Trigger>{props.children}</ContextMenu.Trigger>;
}
