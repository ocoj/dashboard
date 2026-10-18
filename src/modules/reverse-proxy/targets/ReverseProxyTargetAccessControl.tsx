import HelpText from "@components/HelpText";
import { Label } from "@components/Label";
import {
  SelectDropdown,
  SelectOption,
} from "@components/select/SelectDropdown";
import { LockKeyhole, LockOpen, ShieldX } from "lucide-react";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";
import {
  TargetAccessAction,
  type TargetAccessAction as TargetAccessActionValue,
} from "@/interfaces/ReverseProxy";

type Props = {
  value?: string;
  onChange: (value: TargetAccessActionValue) => void;
  privateService: boolean;
};

const isKnownAction = (value: string): value is TargetAccessActionValue =>
  Object.values(TargetAccessAction).some((action) => action === value);

export default function ReverseProxyTargetAccessControl({
  value,
  onChange,
  privateService,
}: Readonly<Props>) {
  const selectedValue = value ?? TargetAccessAction.INHERIT;
  const hasUnsupportedValue = !isKnownAction(selectedValue);

  const options: SelectOption[] = [
    {
      label: zhMap["Use service authentication"] || "Use service authentication",
      value: TargetAccessAction.INHERIT,
      icon: LockKeyhole,
    },
    {
      label: zhMap["Bypass authentication"] || "Bypass authentication",
      value: TargetAccessAction.BYPASS,
      icon: LockOpen,
      disabled: privateService,
    },
    {
      label: zhMap["Block access"] || "Block access",
      value: TargetAccessAction.BLOCK,
      icon: ShieldX,
    },
  ];

  if (hasUnsupportedValue) {
    options.push({
      label: (
        zhMap["Unsupported setting ({value})"] || "Unsupported setting ({value})"
      ).split("{value}").join(selectedValue),
      value: selectedValue,
      disabled: true,
    });
  }

  return (
    <div
      className={"flex items-center justify-between gap-6"}
      data-testid={"target-access-control-setting"}
    >
      <div>
        <Label><TransText>Access</TransText></Label>
        <HelpText className={"mb-0 max-w-sm"}>
          <TransText>Use the service authentication settings, make this location public, or deny requests before they reach the target.</TransText>
        </HelpText>
        {privateService && (
          <div data-testid={"target-access-control-private-service"}>
            <HelpText className={"mb-0 mt-1 !text-yellow-400"}>
              <TransText>NetBird-only services cannot bypass authentication.</TransText>
            </HelpText>
          </div>
        )}
        {hasUnsupportedValue && (
          <div data-testid={"target-access-action-unsupported"}>
            <HelpText className={"mb-0 mt-1 !text-yellow-400"}>
              <TransText>This value is not supported by this dashboard. It will be preserved unless you select a supported option.</TransText>
            </HelpText>
          </div>
        )}
      </div>
      <SelectDropdown
        value={selectedValue}
        onChange={(next) => onChange(next as TargetAccessActionValue)}
        options={options}
        popoverWidth={260}
        className={"w-[260px]"}
        data-testid={"target-access-action"}
      />
    </div>
  );
}
