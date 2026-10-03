import FullTooltip from "@components/FullTooltip";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  disabled?: boolean;
  children?: React.ReactNode;
  hasPermission?: boolean;
  side?: "top" | "right" | "bottom" | "left";
};
export const RDPTooltip = ({
  disabled,
  children,
  hasPermission,
  side = "top",
}: Props) => {
  return (
    <FullTooltip
      className={"w-full"}
      side={side}
      content={
        <div className={"max-w-xs text-xs flex flex-col gap-2"}>
          {hasPermission ? (
            <div><TransText>This peer is offline and cannot be accessed via RDP.</TransText></div>
          ) : (
            <div>
              <TransText>You do not have permission to launch an RDP session. Please contact your administrator.</TransText>
            </div>
          )}
        </div>
      }
      disabled={disabled}
    >
      {children}
    </FullTooltip>
  );
};
