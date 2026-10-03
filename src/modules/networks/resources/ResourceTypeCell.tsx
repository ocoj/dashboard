import Badge from "@components/Badge";
import { NetworkIcon, WorkflowIcon } from "lucide-react";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  single: boolean;
};
export default function ResourceTypeCell({ single }: Props) {
  return (
    <div className={"inline-flex"}>
      {single ? (
        <Badge variant={"gray"} className={"min-w-[130px]"}>
          <WorkflowIcon size={14} /> <TransText>Single IP</TransText>
        </Badge>
      ) : (
        <Badge variant={"gray"} className={"min-w-[130px]"}>
          <NetworkIcon size={14} /> <TransText>IP Range</TransText>
        </Badge>
      )}
    </div>
  );
}
