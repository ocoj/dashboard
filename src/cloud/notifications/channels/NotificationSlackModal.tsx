import Button from "@components/Button";
import InlineLink from "@components/InlineLink";
import { Input } from "@components/Input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
} from "@components/modal/Modal";
import Steps from "@components/Steps";
import { GradientFadedBackground } from "@components/ui/GradientFadedBackground";
import { Mark } from "@components/ui/Mark";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { cn, validator } from "@utils/helpers";
import { isEmpty } from "lodash";
import {
  ExternalLinkIcon,
  GlobeIcon,
  PlusCircle,
  Repeat,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import slackImage from "@/assets/integrations/slack.png";
import { NotificationWebhookChannel as SlackTarget } from "@/interfaces/NotificationChannel";
import { IntegrationModalHeader } from "@/modules/integrations/IntegrationModalHeader";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (target: SlackTarget) => void;
};

export default function NotificationSlackModal({
  open,
  onOpenChange,
  onSave,
}: Readonly<Props>) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} key={open ? 1 : 0}>
      {open && (
        <SlackModalContent
          onSave={(target) => {
            onSave(target);
            onOpenChange(false);
          }}
        />
      )}
    </Modal>
  );
}

type ModalContentProps = {
  onSave: (target: SlackTarget) => void;
};

function SlackModalContent({ onSave }: Readonly<ModalContentProps>) {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");

  const urlError = useMemo(() => {
    if (url === "") return "";
    if (!validator.isValidUrl(url)) {
      return "Please enter a valid url, e.g., https://hooks.slack.com/services/...";
    }
    return "";
  }, [url]);

  const canConnect = !isEmpty(url) && urlError === "";

  const handleConnect = () => {
    onSave({ url });
  };

  const maxSteps = 2;

  return (
    <ModalContent
      maxWidthClass={cn("relative", "max-w-xl")}
      showClose={true}
      onEscapeKeyDown={(e) => step > 0 && e.preventDefault()}
      onInteractOutside={(e) => step > 0 && e.preventDefault()}
      onPointerDownOutside={(e) => step > 0 && e.preventDefault()}
    >
      <GradientFadedBackground />

      <div className={"flex gap-2 w-full items-center justify-center mb-4"}>
        {Array.from({ length: maxSteps }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-8 h-1 rounded-full bg-nb-gray-800",
              step >= index + 1 && "bg-netbird",
            )}
          />
        ))}
      </div>

      <IntegrationModalHeader
        image={slackImage}
        title={zhMap["Connect NetBird with Slack"] || "Connect NetBird with Slack"}
        description={
          "Receive NetBird notification events directly in your Slack channel via an Incoming Webhook."
        }
      />

      {step === 0 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4 mb-3"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <PlusCircle size={18} />
            <TransText>Create a Slack App</TransText>
          </p>

          <Steps>
            <Steps.Step step={1}>
              <p className={"font-normal"}>
                Open{" "}
                <InlineLink
                  href={"https://api.slack.com/apps?new_app=1"}
                  target={"_blank"}
                >
                  <TransText>Slack App Management</TransText>
                  <ExternalLinkIcon size={12} />
                </InlineLink>{" "}
                click <Mark><TransText>Create an app</TransText></Mark> <br />
                and choose <Mark><TransText>From scratch</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={2} line={false}>
              <p className={"font-normal"}>
                Set the app name to{" "}
                <Mark copy={true}><TransText>NetBird Notifications</TransText></Mark> and select your
                workspace. After that click <Mark><TransText>Create App</TransText></Mark>
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step === 1 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <GlobeIcon size={18} />
            <TransText>Configure Incoming Webhook</TransText>
          </p>

          <Steps>
            <Steps.Step step={1}>
              <p className={"font-normal"}>
                <TransText>In the app settings, go to</TransText> <Mark><TransText>Incoming Webhooks</TransText></Mark> and
                toggle <Mark><TransText>Activate Incoming Webhooks</TransText></Mark> to <Mark><TransText>On</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                <TransText>Click</TransText> <Mark><TransText>Add New Webhook</TransText></Mark> and select the channel where
                you want to receive notifications and confirm with{" "}
                <Mark><TransText>Allow</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p className={"font-normal"}>
                <TransText>Copy the generated</TransText> <Mark><TransText>Webhook URL</TransText></Mark> and paste it below.
              </p>
            </Steps.Step>
          </Steps>

          <div className={"mb-4"}>
            <Input
              autoFocus={true}
              type={"text"}
              className={"w-full"}
              customPrefix={
                <div className={"flex items-center gap-2"}>
                  <GlobeIcon size={14} />
                </div>
              }
              placeholder={"https://hooks.slack.com/services/T000/B000/XXXX"}
              value={url}
              error={urlError}
              onChange={(e) => setUrl(e.target.value)}
              data-testid="slack-webhook-url-input"
            />
          </div>
        </div>
      )}

      <ModalFooter className={"items-center gap-4"}>
        {step === 0 && (
          <ModalClose asChild={true}>
            <Button variant={"secondary"} className={"w-full"}>
              <TransText>Cancel</TransText>
            </Button>
          </ModalClose>
        )}
        {step > 0 && (
          <Button
            variant={"secondary"}
            className={"w-full"}
            onClick={() => setStep(step - 1)}
          >
            <IconArrowLeft size={16} />
            <TransText>Back</TransText>
          </Button>
        )}
        {step < maxSteps - 1 && (
          <Button
            variant={"primary"}
            className={"w-full"}
            onClick={() => setStep(step + 1)}
            data-testid="slack-continue"
          >
            <TransText>Continue</TransText>
            <IconArrowRight size={16} />
          </Button>
        )}
        {step === maxSteps - 1 && (
          <Button
            variant={"primary"}
            className={"w-full"}
            disabled={!canConnect}
            onClick={handleConnect}
            data-testid="slack-connect"
          >
            <Repeat size={16} />
            <TransText>Connect</TransText>
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
}
