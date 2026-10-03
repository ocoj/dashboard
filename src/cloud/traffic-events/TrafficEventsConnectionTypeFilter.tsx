import ButtonGroup from "@components/ButtonGroup";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export const TrafficEventsConnectionTypeFilter = ({
  value,
  onChange,
}: Props) => {
  return (
    <ButtonGroup>
      <ButtonGroup.Button
        onClick={() => onChange?.("")}
        variant={value == undefined || value == "" ? "tertiary" : "secondary"}
      >
        <TransText>All</TransText>
      </ButtonGroup.Button>
      <ButtonGroup.Button
        onClick={() => onChange?.("P2P")}
        variant={value === "P2P" ? "tertiary" : "secondary"}
      >
        <TransText>P2P</TransText>
      </ButtonGroup.Button>
      <ButtonGroup.Button
        onClick={() => onChange?.("ROUTED")}
        variant={value === "ROUTED" ? "tertiary" : "secondary"}
      >
        <TransText>Routed</TransText>
      </ButtonGroup.Button>
    </ButtonGroup>
  );
};
