import { For } from "solid-js";
import { useI18n } from "~/lib/i18n";
import { useQrContext } from "~/lib/QrContext";
import {
  ECL_NAMES,
  ECL_VALUE,
  MASK_KEY,
  MASK_NAMES,
  MASK_VALUE,
  MODE_KEY,
  MODE_NAMES,
  MODE_VALUE,
} from "~/lib/options";
import { ButtonGroup, ButtonGroupItem } from "../ButtonGroup";
import { NumberInput } from "../NumberInput";
import { Select } from "../Select";
import { Switch } from "../Switch";

export function Settings() {
  const { inputQr, setInputQr } = useQrContext();
  const { t } = useI18n();

  return (
    <div class="flex flex-col gap-2 py-4">
      <div class="flex justify-between">
        <div class="text-sm py-2">{t().settings.encodingMode}</div>
        <Select
          options={MODE_NAMES}
          value={MODE_KEY[inputQr.mode!]}
          setValue={(name) => setInputQr("mode", MODE_VALUE[name])}
          label={(name) => t().options.mode[name]}
        />
      </div>
      <div class="">
        <div class="flex justify-between">
          <div class="text-sm py-2">
            {inputQr.strictVersion
              ? t().settings.version
              : t().settings.minVersion}
          </div>
          <Switch
            label={t().settings.strict}
            value={inputQr.strictVersion}
            setValue={(v) => setInputQr("strictVersion", v)}
          />
        </div>
        <NumberInput
          min={1}
          max={40}
          value={inputQr.minVersion}
          setValue={(v) => setInputQr("minVersion", v)}
        />
      </div>
      <div>
        <div class="flex justify-between">
          <div class="text-sm py-2">
            {inputQr.strictEcl
              ? t().settings.errorTolerance
              : t().settings.minErrorTolerance}
          </div>
          <Switch
            label={t().settings.strict}
            value={inputQr.strictEcl}
            setValue={(v) => setInputQr("strictEcl", v)}
          />
        </div>
        <ButtonGroup
          value={ECL_NAMES[inputQr.minEcl]}
          setValue={(v) => setInputQr("minEcl", ECL_VALUE[v])}
        >
          <For each={ECL_NAMES}>
            {(name) => (
              <ButtonGroupItem value={name}>
                {t().options.ecl[name]}
              </ButtonGroupItem>
            )}
          </For>
        </ButtonGroup>
      </div>
      <div>
        <div class="text-sm py-2">{t().settings.maskPattern}</div>
        <ButtonGroup
          value={MASK_KEY[inputQr.mask!]}
          setValue={(name) => setInputQr("mask", MASK_VALUE[name])}
        >
          <For each={MASK_NAMES}>
            {(value) => (
              <ButtonGroupItem value={value}>
                {value === "Auto" ? t().options.mask.Auto : value}
              </ButtonGroupItem>
            )}
          </For>
        </ButtonGroup>
      </div>
    </div>
  );
}
