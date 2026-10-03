import FullTooltip from "@components/FullTooltip";
import { TimerResetIcon } from "lucide-react";
import * as React from "react";
import { Peer } from "@/interfaces/Peer";
import { TransText } from "@/i18n/trans-text";

type Props = {
  peer: Peer;
};
export const ExpirationDisabledIndicator = ({ peer }: Props) => {
  if (peer.login_expiration_enabled) {
    return null;
  }

  const tooltipContent = <TransText>Expiration is disabled for this peer.</TransText>;

  return (
    <FullTooltip
      content={<div className={"text-xs max-w-xs"}>{tooltipContent}</div>}
    >
      <TimerResetIcon size={14} className={"shrink-0 text-nb-gray-300"} />
    </FullTooltip>
  );
};
