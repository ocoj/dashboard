import Badge from "@components/Badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/Tooltip";
import { AlertTriangle } from "lucide-react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  loginExpired: boolean;
};
export default function LoginExpiredBadge({ loginExpired }: Props) {
  return loginExpired ? (
    <Tooltip delayDuration={1}>
      <TooltipTrigger>
        <Badge variant={"red"} className={"px-2"}>
          <AlertTriangle size={12} />
          <TransText>Login required</TransText>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className={"text-neutral-300 text-xs leading-1.5"}>
          <TransText>This peer is offline and needs to be</TransText> <br />
          <TransText>re-authenticated because its login has expired.</TransText>
        </div>
      </TooltipContent>
    </Tooltip>
  ) : null;
}
