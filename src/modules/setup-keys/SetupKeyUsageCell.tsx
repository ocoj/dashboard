import { IconRepeat } from "@tabler/icons-react";
import { Repeat1 } from "lucide-react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  current: number;
  limit: number;
  reusable: boolean;
};
export default function SetupKeyUsageCell({ current, limit, reusable }: Props) {
  return reusable ? (
    <div className={"flex items-center text-[13px] text-nb-gray-300 gap-2"}>
      <IconRepeat size={14} className={"text-green-400"} />
      <span>
        <span className={"font-medium text-nb-gray-200"}> {current} </span> <TransText>of</TransText>{" "}
        {limit == 0 ? <><TransText>Unlimited</TransText></> : limit} <TransText>Peers</TransText>
      </span>
    </div>
  ) : (
    <div className={"flex items-center text-[13px] text-nb-gray-300 gap-2"}>
      <Repeat1 size={14} /> <TransText>One-off</TransText>
    </div>
  );
}
