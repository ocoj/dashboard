import Badge from "@components/Badge";
import * as React from "react";
import {
  TrafficEvent,
  TrafficEventDirection,
} from "@/cloud/traffic-events/interfaces/TrafficEvent";
import { TransText } from "@/i18n/trans-text";

type Props = {
  event: TrafficEvent;
};

export const TrafficEventsDirectionCell = ({ event }: Props) => {
  const direction = event.direction;
  const isInbound = direction === TrafficEventDirection.INGRESS;

  return direction === TrafficEventDirection.UNKNOWN ? (
    <Badge variant={"gray"} className={"py-1 w-[80px]"}>
      <TransText>Unknown</TransText>
    </Badge>
  ) : (
    <Badge variant={"gray"} className={"py-1 w-[80px]"}>
      {isInbound ? "Inbound" : "Outbound"}
    </Badge>
  );
};
