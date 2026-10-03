import Button from "@components/Button";
import SquareIcon from "@components/SquareIcon";
import {
  ArrowRightIcon,
  BotIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
} from "lucide-react";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

type Props = {
  onNext: () => void;
};

// OnboardingAgentWelcome is the first step of the Agent Network onboarding.
// It frames what Agent Network does before the operator starts wiring up a
// device, provider, and policy. Mirrors the intro of the quickstart guide.
export const OnboardingAgentWelcome = ({ onNext }: Props) => {
  return (
    <div className={"relative flex flex-col h-full gap-4"}>
      <div>
        <h1 className={"text-xl text-center"}><TransText>Welcome to Agent Network</TransText></h1>
        <div
          className={
            "text-sm text-nb-gray-300 font-light mt-2 block text-center sm:px-4"
          }
        >
          {`Agent Network is the access-control layer for AI agents. Route LLM
          requests through one keyless endpoint and give agents scoped access to
          internal resources, all enforced by your policies.`}
        </div>
      </div>

      <div className={"mt-4 flex flex-col gap-4"}>
        <Highlight
          icon={<KeyRoundIcon size={16} />}
          title={zhMap["Keyless access over the tunnel"] || "Keyless access over the tunnel"}
          description={
            "Agents access LLM providers and internal resources through encrypted WireGuard tunnel, without exposing API keys on the client."
          }
        />
        <Highlight
          icon={<ShieldCheckIcon size={16} />}
          title={zhMap["Policy-controlled access"] || "Policy-controlled access"}
          description={
            "Every request is authorized against your policies before it reaches a provider, with optional token and budget limits and guardrails."
          }
        />
        <Highlight
          icon={<BotIcon size={16} />}
          title={zhMap["Per-identity usage & logs"] || "Per-identity usage & logs"}
          description={
            "See who called which model, how many tokens it cost, and whether it was allowed. All attributed to the real caller."
          }
        />
      </div>

      <div className={"flex items-center justify-center mt-6"}>
        <Button variant={"primary"} onClick={onNext}>
          <TransText>Get Started</TransText>
          <ArrowRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

const Highlight = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className={"flex gap-3 items-start"}>
      <SquareIcon color={"netbird"} margin={""} icon={icon} />
      <div>
        <div className={"text-sm"}>{title}</div>
        <div className={"text-[0.8rem] text-nb-gray-300 font-light mt-1 block"}>
          {description}
        </div>
      </div>
    </div>
  );
};
