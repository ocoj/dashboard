import { useTranslations } from "next-intl";
import { IconRepeat } from "@tabler/icons-react";
import { Repeat1 } from "lucide-react";

type Props = {
  current: number;
  limit: number;
  reusable: boolean;
};
export default function SetupKeyUsageCell({ current, limit, reusable }: Props) {
  const t = useTranslations("setupKeys");
  return reusable ? (
    <div className={"flex items-center text-[13px] text-nb-gray-300 gap-2"}>
      <IconRepeat size={14} className={"text-green-400"} />
      <span>
        <span className={"font-medium text-nb-gray-200"}> {current} </span>{" "}
        {t("ofSuffix")}{" "}
        {limit == 0 ? <>{t("unlimited")}</> : limit} {t("peers")}
      </span>
    </div>
  ) : (
    <div className={"flex items-center text-[13px] text-nb-gray-300 gap-2"}>
      <Repeat1 size={14} /> {t("oneOff")}
    </div>
  );
}
