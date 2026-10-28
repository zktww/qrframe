import { useI18n } from "~/lib/i18n";
import type { Ecl, Mask } from "furious-qr";
import { useQrContext } from "~/lib/QrContext";
import { ENCODER_NAMES, type EncoderName } from "~/lib/options";
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
        <div class="text-sm py-2">{t().settings.encoder}</div>
        <Select
          options={ENCODER_NAMES}
          value={inputQr.encoder}
          setValue={(name) => setInputQr("encoder", name as EncoderName)}
          label={(name) => t().options.encoder[name as EncoderName]}
        />
      </div>
      <div>
        <div class="flex justify-between">
          <div class="text-sm py-2">
            {inputQr.exactVersion ? t().settings.version : t().settings.minVersion}
          </div>
          <Switch
            label={t().settings.exact}
            value={inputQr.exactVersion}
            setValue={(v) => setInputQr("exactVersion", v)}
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
            {inputQr.exactEcl ? t().settings.errorTolerance : t().settings.minErrorTolerance}
          </div>
          <Switch
            label={t().settings.exact}
            value={inputQr.exactEcl}
            setValue={(v) => setInputQr("exactEcl", v)}
          />
        </div>
        <ButtonGroup
          value={inputQr.minEcl.toString()}
          setValue={(v) => setInputQr("minEcl", parseInt(v) as Ecl)}
        >
          <ButtonGroupItem value="0">7%</ButtonGroupItem>
          <ButtonGroupItem value="1">15%</ButtonGroupItem>
          <ButtonGroupItem value="2">25%</ButtonGroupItem>
          <ButtonGroupItem value="3">30%</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <div class="text-sm py-2">{t().settings.maskPattern}</div>
        <ButtonGroup
          value={inputQr.mask.toString()}
          setValue={(name) => setInputQr("mask", parseInt(name) as Mask)}
        >
          <ButtonGroupItem value="0">0</ButtonGroupItem>
          <ButtonGroupItem value="1">1</ButtonGroupItem>
          <ButtonGroupItem value="2">2</ButtonGroupItem>
          <ButtonGroupItem value="3">3</ButtonGroupItem>
          <ButtonGroupItem value="4">4</ButtonGroupItem>
          <ButtonGroupItem value="5">5</ButtonGroupItem>
          <ButtonGroupItem value="6">6</ButtonGroupItem>
          <ButtonGroupItem value="7">7</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  );
}
