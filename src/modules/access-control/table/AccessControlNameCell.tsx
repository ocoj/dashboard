import DescriptionWithTooltip from "@components/ui/DescriptionWithTooltip";
import React from "react";
import { Policy } from "@/interfaces/Policy";
import ActiveInactiveRow from "@/modules/common-table-rows/ActiveInactiveRow";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

type Props = {
  policy: Policy;
};

export default function AccessControlNameCell({ policy }: Readonly<Props>) {
  return (
    <ActiveInactiveRow
      active={policy.enabled}
      inactiveDot={"gray"}
      text={policy.name}
      data-testid={policy.name}
    >
      <DescriptionWithTooltip className={"mt-1"} text={zhMap[policy.description] || policy.description} />
    </ActiveInactiveRow>
  );
}
