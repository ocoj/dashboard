import FullTooltip from "@components/FullTooltip";
import { TriangleAlertIcon } from "lucide-react";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  size?: number;
};
export const NetworkRoutesDeprecationInfo = ({ size = 14 }: Props) => {
  return (
    <FullTooltip
      content={
        <div className={"text-xs max-w-[230px]"}>
          <TransText>Network Routes will be deprecated and replaced with Networks.</TransText>
        </div>
      }
    >
      <TriangleAlertIcon
        size={size}
        className={"text-amber-500 ml-2.5 hover:text-amber-400 cursor-help"}
      />
    </FullTooltip>
  );
};
