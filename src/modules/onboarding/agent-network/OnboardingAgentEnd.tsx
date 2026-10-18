import Button from "@components/Button";
import { Callout } from "@components/Callout";
import InlineLink, { InlineButtonLink } from "@components/InlineLink";
import useFetchApi from "@utils/api";
import {
  ChartColumnIcon,
  CheckIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  GaugeIcon,
  KeyRoundIcon,
  ListChecksIcon,
  LucideIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
  SquareTerminalIcon,
  XCircleIcon,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";
import type {
  APIAgentNetworkAccessLog,
  APIAgentNetworkAccessLogsResponse,
} from "@/modules/agent-network/agentAccessLogApi";
import { useAIProviders } from "@/modules/agent-network/AIProvidersProvider";
import { formatDenyReason } from "@/modules/agent-network/data/mockData";
import {
  TEST_REQUEST_LOOKBACK_MS,
  TEST_REQUEST_POLL_MS,
  testRequestLogUrl,
  TestRequestOutcome,
  testRequestOutcome,
} from "@/modules/onboarding/agent-network/testRequest";
import { WaitingForDevice } from "@/modules/onboarding/OnboardingDevices";

const QUICKSTART_DOCS = "https://docs.netbird.io/agent-network/quickstart";

// fill substitutes {name} placeholders in a zh-map template.
const fill = (template: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => acc.split(`{${key}}`).join(String(value)),
    template,
  );

type Props = {
  // deviceName names the operator's device, where the test request has to
  // come from: only a peer in the policy reaches the endpoint.
  deviceName?: string;
  // userId is the operator's: only their own request counts as the test, not
  // another user's traffic on the account.
  userId?: string;
  onBack: () => void;
  onFinish: () => void;
};

// OnboardingAgentEnd asks for a test request and watches the access log for
// it, as the network onboarding asks for a ping. The operator can skip it.
export const OnboardingAgentEnd = ({
  deviceName,
  userId,
  onBack,
  onFinish,
}: Props) => {
  const outcome = useTestRequest(userId);

  if (outcome.kind === "passed") {
    return <AllSet entry={outcome.entry} onBack={onBack} onFinish={onFinish} />;
  }

  return (
    <div className={"relative flex flex-col h-full gap-4"}>
      <div>
        <h1 className={"text-xl text-center max-w-sm mx-auto"}>
          <TransText>Send a test request</TransText>
        </h1>
        <div
          className={
            "text-sm text-nb-gray-300 font-light mt-2 block text-center sm:px-4"
          }
        >
          <TransText>Run your agent, or the cURL command from the previous step, on</TransText>{" "}
          <span className={"text-nb-gray-100 whitespace-nowrap"}>
            {deviceName || <TransText>your device</TransText>}
          </span>
          <TransText>. The request shows up here once NetBird logs it.</TransText>
        </div>
      </div>

      <TestRequestStatus outcome={outcome} onOpenLogs={onFinish} />

      <div className={"flex items-center justify-center mt-4 gap-3"}>
        <Button variant={"secondary"} onClick={onBack}>
          <TransText>Go Back</TransText>
        </Button>
        <Button variant={"secondaryLighter"} onClick={onFinish}>
          <TransText>Skip</TransText>
        </Button>
      </div>
    </div>
  );
};

// The dashboard's Agent Network sections, one line each.
const SECTIONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: KeyRoundIcon,
    title: "Providers",
    description: "Connect providers and pick models.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Policies",
    description: "Choose who can use each provider.",
  },
  {
    icon: ListChecksIcon,
    title: "Guardrails",
    description: "Limit models and capture prompts.",
  },
  {
    icon: GaugeIcon,
    title: "Budgets and limits",
    description: "Cap token use and spend.",
  },
  {
    icon: ChartColumnIcon,
    title: "Usage",
    description: "Track tokens and spend over time.",
  },
  {
    icon: ScrollTextIcon,
    title: "Access Logs",
    description: "See every request and who sent it.",
  },
  {
    icon: DatabaseIcon,
    title: "Log retention",
    description: "Choose how long logs are kept.",
  },
  {
    icon: SquareTerminalIcon,
    title: "Agent setup",
    description: "Configure Claude Code and Codex.",
  },
];

// AllSet is where a passed test request ends the onboarding: it confirms the
// request and lists what the dashboard offers from here.
const AllSet = ({
  entry,
  onBack,
  onFinish,
}: {
  entry: APIAgentNetworkAccessLog;
  onBack: () => void;
  onFinish: () => void;
}) => (
  <div className={"relative flex flex-col h-full gap-4"}>
    <div>
      <h1 className={"text-xl text-center max-w-sm mx-auto"}>
        <TransText>You&apos;re all set!</TransText>
      </h1>
      <PassedRequest entry={entry} />
    </div>

    <ul
      className={"mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm"}
      data-testid={"agent-network-sections"}
    >
      {SECTIONS.map(({ icon: Icon, title, description }) => (
        <li key={title} className={"flex items-start gap-3"}>
          <Icon size={16} className={"text-nb-gray-400 shrink-0 mt-0.5"} />
          <div>
            <div className={"text-nb-gray-100"}><TransText>{title}</TransText></div>
            <div className={"text-nb-gray-400 font-light mt-0.5"}>
              <TransText>{description}</TransText>
            </div>
          </div>
        </li>
      ))}
    </ul>

    <div className={"flex items-center justify-center mt-4 gap-3"}>
      <Button variant={"secondary"} onClick={onBack}>
        <TransText>Go Back</TransText>
      </Button>
      <Button variant={"primary"} onClick={onFinish}>
        <TransText>Finish</TransText>
        <CheckIcon size={16} />
      </Button>
    </div>
  </div>
);

// PassedRequest is the step's subtitle: it names the provider the test
// request was routed to when it is one of the account's.
const PassedRequest = ({ entry }: { entry: APIAgentNetworkAccessLog }) => {
  const { providers } = useAIProviders();
  const provider = providers.find((p) => p.id === entry.resolved_provider_id);

  return (
    <div
      className={
        "text-sm text-nb-gray-300 font-light mt-2 block text-center sm:px-4"
      }
      data-testid={"agent-network-test-passed"}
    >
      {passedSentence(entry, provider?.name)}
    </div>
  );
};

// passedSentence reads e.g. "Your request reached Anthropic and used 1,234
// tokens.", naming the model when the provider is unknown.
const passedSentence = (
  entry: APIAgentNetworkAccessLog,
  providerName?: string,
) => {
  const target = providerName || entry.model;
  const tokens =
    entry.total_tokens > 0 ? entry.total_tokens.toLocaleString() : undefined;
  const tpl = (key: string, fallback: string) => zhMap[key] || fallback;
  if (!target) {
    return tokens
      ? fill(
          tpl(
            "Your request went through and used {tokens} tokens.",
            "Your request went through and used {tokens} tokens.",
          ),
          { tokens },
        )
      : tpl("Your request went through.", "Your request went through.");
  }
  return tokens
    ? fill(
        tpl(
          "Your request reached {target} and used {tokens} tokens.",
          "Your request reached {target} and used {tokens} tokens.",
        ),
        { target, tokens },
      )
    : fill(
        tpl("Your request reached {target}.", "Your request reached {target}."),
        { target },
      );
};

// TestRequestStatus shows what became of the latest request. onOpenLogs leaves
// the onboarding for the Access Logs, as the onboarding covers every page
// while it is open.
const TestRequestStatus = ({
  outcome,
  onOpenLogs,
}: {
  outcome: Exclude<TestRequestOutcome, { kind: "passed" }>;
  onOpenLogs: () => void;
}) => {
  if (outcome.kind === "waiting") {
    return (
      <WaitingForDevice
        text={zhMap["Waiting for your first request"] || "Waiting for your first request"}
      />
    );
  }

  const { entry } = outcome;
  const tpl = (key: string, fallback: string) => zhMap[key] || fallback;
  const denied = entry.model
    ? fill(
        tpl(
          "Your last request, for {model}, was denied: {reason}.",
          "Your last request, for {model}, was denied: {reason}.",
        ),
        {
          model: entry.model,
          reason:
            formatDenyReason(entry.deny_reason) || tpl("no reason given", "no reason given"),
        },
      )
    : fill(
        tpl(
          "Your last request was denied: {reason}.",
          "Your last request was denied: {reason}.",
        ),
        {
          reason:
            formatDenyReason(entry.deny_reason) || tpl("no reason given", "no reason given"),
        },
      );
  const reached = entry.model
    ? fill(
        tpl(
          "Your last request, for {model}, reached the provider and came back with status {status}.",
          "Your last request, for {model}, reached the provider and came back with status {status}.",
        ),
        { model: entry.model, status: entry.status_code },
      )
    : fill(
        tpl(
          "Your last request reached the provider and came back with status {status}.",
          "Your last request reached the provider and came back with status {status}.",
        ),
        { status: entry.status_code },
      );

  return (
    <div className={"flex flex-col"}>
      <Callout
        variant={outcome.kind === "denied" ? "error" : "warning"}
        icon={<XCircleIcon size={16} className={"shrink-0 mt-0.5"} />}
        data-testid={`agent-network-test-${outcome.kind}`}
      >
        <p>{outcome.kind === "denied" ? denied : reached}</p>
        <p className={"mt-1"}>
          <TransText>Learn more in the</TransText>{" "}
          <InlineButtonLink variant={"dashed"} onClick={onOpenLogs}>
            <TransText>Access Logs</TransText>
          </InlineButtonLink>{" "}
          <TransText>or the</TransText>{" "}
          <InlineLink
            variant={"dashed"}
            href={QUICKSTART_DOCS}
            target={"_blank"}
          >
            <TransText>docs</TransText>
            <ExternalLinkIcon size={12} />
          </InlineLink>
          .
        </p>
      </Callout>
      <WaitingForDevice text={zhMap["Waiting for your next request"] || "Waiting for your next request"} />
    </div>
  );
};

// windowStart opens the window the test request is looked for in.
const windowStart = () => new Date(Date.now() - TEST_REQUEST_LOOKBACK_MS);

// useTestRequest reads the operator's newest request since shortly before the
// step opened, until one passes. It reads nothing until it knows the operator.
// A timer drives the reads, not SWR's focus revalidation, so a passed request
// stays on screen.
function useTestRequest(userId?: string): TestRequestOutcome {
  const [since] = useState(windowStart);
  const { data, mutate } = useFetchApi<APIAgentNetworkAccessLogsResponse>(
    testRequestLogUrl(since, userId ?? ""),
    true,
    false,
    !!userId,
    { shouldRetryOnError: false },
  );
  const outcome = testRequestOutcome(data?.data?.[0]);
  const watching = !!userId && outcome.kind !== "passed";

  useEffect(() => {
    if (!watching) return;
    const timer = setInterval(() => mutate(), TEST_REQUEST_POLL_MS);
    return () => clearInterval(timer);
  }, [watching, mutate]);

  return outcome;
}
