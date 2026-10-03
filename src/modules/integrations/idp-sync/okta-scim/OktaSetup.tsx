import Button from "@components/Button";
import InlineLink from "@components/InlineLink";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
} from "@components/modal/Modal";
import Steps from "@components/Steps";
import { GradientFadedBackground } from "@components/ui/GradientFadedBackground";
import { Lightbox } from "@components/ui/Lightbox";
import { Mark } from "@components/ui/Mark";
import { MinimalList } from "@components/ui/MinimalList";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useApiCall } from "@utils/api";
import { cn } from "@utils/helpers";
import { isEmpty } from "lodash";
import {
  Box,
  Clock4,
  FolderGit2,
  LogInIcon,
  MailIcon,
  PlusCircle,
  Settings2,
  Share2,
  Shield,
  UserCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useEmbeddedIdentityProviders } from "@/hooks/useEmbeddedIdentityProviders";
import integrationImage from "@/assets/integrations/okta.png";
import { OktaIntegration } from "@/interfaces/IdentityProvider";
import oktaGroupsAssignments from "@/modules/integrations/idp-sync/okta-scim/images/okta-groups-assignments.png";
import oktaSCIMToApp from "@/modules/integrations/idp-sync/okta-scim/images/okta-scim-to-app-sync-enabled.png";
import oktaSSO from "@/modules/integrations/idp-sync/okta-scim/images/okta-sso-configuration.png";
import oktaSyncGroups from "@/modules/integrations/idp-sync/okta-scim/images/okta-sync-groups.png";
import { EmbeddedIdentityProviderSelect } from "@/modules/integrations/idp-sync/EmbeddedIdentityProviderSelect";
import { IntegrationModalHeader } from "@/modules/integrations/IntegrationModalHeader";
import { useEnterpriseConnections } from "@/modules/integrations/sso/useEnterpriseConnections";
import { TransText } from "@/i18n/trans-text";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function OktaSetup({ open, onOpenChange, onSuccess }: Props) {
  const [authToken, setAuthToken] = useState("");
  const [connectorId, setConnectorId] = useState("");
  const { oktaConnection } = useEnterpriseConnections();

  const integrationsRequest = useApiCall<OktaIntegration[]>(
    "/integrations/okta-scim-idp",
  );

  const authTokenRequest = useApiCall<OktaIntegration>(
    "/integrations/okta-scim-idp",
    true,
  ).post;

  useEffect(() => {
    if (!open) return;
    if (!oktaConnection) return;
    const getAuthToken = async () => {
      const integration = await integrationsRequest.get();
      if (!isEmpty(integration)) {
        const integrationId = integration[0].id;
        if (authToken != "") return authToken;
        const okta = await authTokenRequest(
          {
            connection_name: oktaConnection.name,
          },
          `/${integrationId}/token`,
        );
        if (!okta) return "";
        return okta.auth_token;
      } else {
        const okta = await authTokenRequest({
          connection_name: oktaConnection.name,
          ...(connectorId ? { connector_id: connectorId } : {}),
        });
        if (!okta) return "";
        return okta.auth_token;
      }
    };

    getAuthToken().then((t) => setAuthToken(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {open && (
        <SetupContent
          authToken={authToken}
          connectorId={connectorId}
          onConnectorIdChange={setConnectorId}
          onSuccess={() => {
            onOpenChange(false);
            onSuccess && onSuccess();
          }}
        />
      )}
    </Modal>
  );
}

type ModalProps = {
  onSuccess: () => void;
  authToken: string;
  connectorId?: string;
  onConnectorIdChange?: (value: string) => void;
};

export function SetupContent({
  onSuccess,
  authToken,
  connectorId = "",
  onConnectorIdChange,
}: ModalProps) {
  const { isEmbeddedIdPEnabled } = useEmbeddedIdentityProviders();
  const [step, setStep] = useState(isEmbeddedIdPEnabled ? -1 : 0);
  const maxSteps = 5;

  return (
    <ModalContent
      maxWidthClass={cn(
        "relative",
        step == 0
          ? "max-w-lg"
          : step == 2
          ? "max-w-2xl"
          : step == 1
          ? "max-w-lg"
          : "max-w-xl",
        step === -1 && "max-w-lg",
      )}
      showClose={true}
      className={""}
      onEscapeKeyDown={(e) => step > 0 && e.preventDefault()}
      onInteractOutside={(e) => step > 0 && e.preventDefault()}
      onPointerDownOutside={(e) => step > 0 && e.preventDefault()}
    >
      <GradientFadedBackground />

      {step > 0 && (
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
      )}

      <IntegrationModalHeader
        image={integrationImage}
        title={"Connect NetBird with Okta"}
        description={
          "Start syncing your users and groups from Okta to NetBird. Follow the steps below to get started."
        }
      />

      {step === -1 && onConnectorIdChange && (
        <EmbeddedIdentityProviderSelect
          value={connectorId}
          onChange={onConnectorIdChange}
          location="setup"
          filterByType={["okta"]}
        />
      )}

      {step == 0 && (
        <div
          className={
            "px-8 py-3 flex z-0 flex-col gap-0 text-sm mb-3 text-center justify-center items-center"
          }
        >
          <div
            className={
              "mt-6 text-base font-medium text-nb-gray-100 flex gap-2 items-center justify-center"
            }
          >
            <Shield size={16} />
            Required Permissions
          </div>
          <p className={"mt-2 !text-nb-gray-300 !leading-[1.5]"}>
            Ensure that you have an{" "}
            <span className={"text-nb-gray-100 font-semibold"}>
              <TransText>Okta user account</TransText>
            </span>{" "}
            with the following{" "}
            <span className={"text-nb-gray-100 font-semibold"}>
              permissions
            </span>
            .{" "}
            {
              "If you don't have the required permissions, ask your Okta administrator to grant them to you."
            }
          </p>
          <div
            className={
              "flex items-center flex-col gap-0 mt-2 w-full justify-center max-w-lg"
            }
          >
            <div
              className={
                "py-2 px-6 flex items-center gap-2 rounded-md w-full justify-center bg-nb-gray-930/0 text-nb-gray-200"
              }
            >
              <PlusCircle size={14} className={"text-sky-500"} />
              Add Okta applications
            </div>
            <div
              className={
                "py-2 px-6 flex items-center gap-2 rounded-md w-full justify-center bg-nb-gray-930/0 text-nb-gray-200"
              }
            >
              <Settings2 size={14} className={"text-sky-500"} />
              Configure Okta applications
            </div>
          </div>
        </div>
      )}

      {step == 1 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <LogInIcon size={20} />
            Configure SSO in Okta
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p className={"font-normal"}>
                Access the Okta dashboard and navigate to{" "}
                <Mark>{"Applications > Applications"}</Mark>, selecting the
                previously installed <Mark><TransText>NetBird</TransText></Mark> application
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                Go to <Mark>{"Sign On > Settings"}</Mark> and select{" "}
                <Mark><TransText>Edit</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p className={"font-normal"}>
                In the <Mark><TransText>Credentials Details</TransText></Mark> section, change the
                <Mark><TransText>Application username format</TransText></Mark> to <Mark><TransText>Email</TransText></Mark>{" "}
                and select <Mark><TransText>Save</TransText></Mark>
              </p>
              <Lightbox image={oktaSSO} />
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 2 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <Share2 size={20} />
            Enable Okta SCIM in NetBird
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                From the Okta dashboard, navigate to{" "}
                <Mark>{"Applications > Applications"}</Mark> and select the{" "}
                <Mark><TransText>NetBird</TransText></Mark> application
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                Under the <Mark><TransText>Provisioning</TransText></Mark> tab, choose{" "}
                <Mark><TransText>Integration</TransText></Mark>, then select{" "}
                <Mark><TransText>Configure API Integration</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3}>
              <p className={"font-normal"}>
                Opt to <Mark><TransText>Enable API integration</TransText></Mark> and insert this token
                into the <Mark><TransText>API Token</TransText></Mark> field
              </p>
              <MinimalList
                data={[{ label: "Authorization (Bearer)", value: authToken }]}
              />
            </Steps.Step>
            <Steps.Step step={4} line={false}>
              <p className={"font-normal"}>
                Click <Mark><TransText>Test API Credentials</TransText></Mark> to verify the SCIM
                connection, then select <Mark><TransText>Save</TransText></Mark>
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 3 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <Box size={20} />
            Configure SCIM provisioning to NetBird
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                Go to the <Mark>{"Provisioning > Settings > To App"}</Mark> and
                click <Mark><TransText>Edit</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={2} line={false}>
              <p className={"font-normal"}>
                Enable <Mark><TransText>Create Users</TransText></Mark>,{" "}
                <Mark><TransText>Update User Attributes</TransText></Mark>, and{" "}
                <Mark><TransText>Deactivate Users</TransText></Mark> and click <Mark><TransText>Save</TransText></Mark>
              </p>
              <Lightbox image={oktaSCIMToApp} />
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 4 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <UserCircle size={20} />
            Sync Users to NetBird
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                Go to the <Mark><TransText>Assignments</TransText></Mark> tab, select the{" "}
                <Mark><TransText>Assign</TransText></Mark> and click <Mark><TransText>Assign to Groups</TransText></Mark>
              </p>
              <Lightbox image={oktaGroupsAssignments} />
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                Select the groups you want to provision, and then select{" "}
                <Mark><TransText>Assign</TransText></Mark> and click <Mark><TransText>Save and Go Back</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p className={"font-normal"}>
                Select <Mark><TransText>Done</TransText></Mark> after you have finished assigning
                groups. At this point, all members of the groups assigned to the
                application will be synced to NetBird.
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 5 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <FolderGit2 size={20} />
            Sync Groups to NetBird
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                Go to the <Mark><TransText>Push Groups</TransText></Mark> tab, select{" "}
                <Mark><TransText>Push Groups</TransText></Mark> and click{" "}
                <Mark><TransText>Find groups by name</TransText></Mark>
              </p>
              <Lightbox image={oktaSyncGroups} />
            </Steps.Step>
            <Steps.Step step={2} line={false}>
              <p className={"font-normal"}>
                Search groups to push and then click <Mark><TransText>Save</TransText></Mark>. The
                selected groups will then be synced to NetBird.
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      <ModalFooter className={"items-center gap-4"}>
        {step === -1 && (
          <Button
            variant={"primary"}
            className={"w-full"}
            onClick={() => setStep(step + 1)}
            disabled={!connectorId || connectorId === ""}
          >
            Continue
            <IconArrowRight size={16} />
          </Button>
        )}
        {step > 0 && (
          <Button
            variant={"secondary"}
            className={"w-full"}
            onClick={() => setStep(step - 1)}
          >
            <IconArrowLeft size={16} />
            Back
          </Button>
        )}
        {step >= 0 && step < maxSteps && (
          <Button
            variant={"primary"}
            className={"w-full"}
            onClick={() => setStep(step + 1)}
          >
            {step == 0 ? "Get Started" : "Continue"}
            <IconArrowRight size={16} />
          </Button>
        )}
        {step == maxSteps && (
          <Button
            variant={"primary"}
            className={"w-full"}
            onClick={() => {
              onSuccess();
            }}
          >
            <TransText>Finish Setup</TransText>
          </Button>
        )}
      </ModalFooter>
      {(step == 0 || step == -1) && (
        <div
          className={
            "text-center z-0 mt-2.5 text-xs text-nb-gray-300 flex items-center justify-center gap-2 font-normal"
          }
        >
          <Clock4 size={12} />
          <div>
            Estimated setup time:
            <span className={"font-medium"}> 5-15 Minutes</span>
          </div>
        </div>
      )}
    </ModalContent>
  );
}

export function SetupSSOContent() {
  const [step, setStep] = useState(0);
  const maxSteps = 2;

  return (
    <ModalContent
      maxWidthClass={cn("relative", step == 2 ? "max-w-xl" : "max-w-lg")}
      showClose={true}
      className={""}
      onEscapeKeyDown={(e) => step > 0 && e.preventDefault()}
      onInteractOutside={(e) => step > 0 && e.preventDefault()}
      onPointerDownOutside={(e) => step > 0 && e.preventDefault()}
    >
      <GradientFadedBackground />

      {step > 0 && (
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
      )}

      <IntegrationModalHeader
        image={integrationImage}
        title={"Connect NetBird with Okta"}
        description={
          "Start syncing your users and groups from Okta to NetBird. Follow the steps below to get started."
        }
      />

      {step == 0 && (
        <div
          className={
            "px-8 py-3 flex z-0 flex-col gap-0 text-sm mb-3 text-center justify-center items-center"
          }
        >
          <div
            className={
              "mt-6 text-base font-medium text-nb-gray-100 flex gap-2 items-center justify-center"
            }
          >
            <Shield size={16} />
            Required Permissions
          </div>
          <p className={"mt-2 !text-nb-gray-300 !leading-[1.5]"}>
            Ensure that you have an{" "}
            <span className={"text-nb-gray-100 font-semibold"}>
              <TransText>Okta user account</TransText>
            </span>{" "}
            with the following{" "}
            <span className={"text-nb-gray-100 font-semibold"}>
              permissions
            </span>
            .{" "}
            {
              "If you don't have the required permissions, ask your Okta administrator to grant them to you."
            }
          </p>
          <div
            className={
              "flex items-center flex-col gap-0 mt-2 w-full justify-center max-w-lg"
            }
          >
            <div
              className={
                "py-2 px-6 flex items-center gap-2 rounded-md w-full justify-center bg-nb-gray-930/0 text-nb-gray-200"
              }
            >
              <PlusCircle size={14} className={"text-sky-500"} />
              Add Okta applications
            </div>
            <div
              className={
                "py-2 px-6 flex items-center gap-2 rounded-md w-full justify-center bg-nb-gray-930/0 text-nb-gray-200"
              }
            >
              <Settings2 size={14} className={"text-sky-500"} />
              Configure Okta applications
            </div>
          </div>
        </div>
      )}

      {step == 1 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <Box size={20} />
            Install NetBird application for Okta
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                Navigate to{" "}
                <InlineLink
                  className={"inline"}
                  target={"_blank"}
                  href={"https://www.okta.com/integrations/netbird"}
                >
                  <TransText>Okta Integration Network</TransText>
                </InlineLink>
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                Click <Mark>+ Add Integration</Mark> and then <Mark><TransText>Done</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p>
                After installing the application go to the{" "}
                <Mark><TransText>Assignments</TransText></Mark> tab, select the <Mark><TransText>Assign</TransText></Mark> and
                click <Mark><TransText>Assign to People</TransText></Mark> and assign your user to the
                application
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 2 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <MailIcon size={20} />
            Share your Okta details with NetBird
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p className={"font-normal"}>
                Click on the <Mark>{"Sign On"}</Mark> tab and take note <br />
                of the <Mark><TransText>Client ID</TransText></Mark> and <Mark><TransText>Client secret</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                Under your user profile, take note of your{" "}
                <Mark><TransText>Okta account domain</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3}>
              <p className={"font-normal"}>
                Share your <Mark><TransText>Client ID</TransText></Mark> <Mark><TransText>Client secret</TransText></Mark>{" "}
                <Mark><TransText>Okta account domain</TransText></Mark> and your {"user's"}
                <Mark><TransText>Primary email domain</TransText></Mark> with the NetBird team
              </p>
            </Steps.Step>
            <Steps.Step step={4} line={false}>
              <p className={"font-normal"}>
                Once the NetBird team has enabled the authentication for your
                account you will receive an email. After that you can visit{" "}
                <InlineLink href={"https://app.netbird.io"}>
                  app.netbird.io
                </InlineLink>{" "}
                and authenticate using your Okta’s credentials
              </p>
            </Steps.Step>
          </Steps>

          <div className={"flex flex-col gap-6 max-w-lg mb-4 z-0"}>
            <div
              className={
                "bg-netbird-950 px-6 py-4 rounded-md border border-netbird-500 "
              }
            >
              <p className={"!text-netbird-200"}>
                You can use{" "}
                <InlineLink
                  href={"mailto:support@netbird.io"}
                  className={"inline !text-netbird-500 font-medium"}
                >
                  {" "}
                  1Password
                </InlineLink>{" "}
                or any other secure sharing tool to share your Okta details with
                the NetBird team. If you need help, please contact us at{" "}
                <InlineLink
                  href={"mailto:support@netbird.io"}
                  className={"inline !text-netbird-500 font-medium"}
                >
                  {" "}
                  support@netbird.io
                </InlineLink>{" "}
              </p>
            </div>
          </div>
        </div>
      )}

      <ModalFooter className={"items-center gap-4"}>
        {step > 0 && (
          <Button
            variant={"secondary"}
            className={"w-full"}
            onClick={() => setStep(step - 1)}
          >
            <IconArrowLeft size={16} />
            Back
          </Button>
        )}
        {step >= 0 && step < maxSteps && (
          <Button
            variant={"primary"}
            className={"w-full"}
            onClick={() => setStep(step + 1)}
          >
            {step == 0 ? "Get Started" : "Continue"}
            <IconArrowRight size={16} />
          </Button>
        )}
        {step == maxSteps && (
          <ModalClose asChild={true}>
            <Button variant={"primary"} className={"w-full"}>
              <TransText>Close</TransText>
            </Button>
          </ModalClose>
        )}
      </ModalFooter>
      {step == 0 && (
        <div
          className={
            "text-center z-0 mt-2.5 text-xs text-nb-gray-300 flex items-center justify-center gap-2 font-normal"
          }
        >
          <Clock4 size={12} />
          <div>
            Estimated setup time:
            <span className={"font-medium"}> 5 Minutes</span>
          </div>
        </div>
      )}
    </ModalContent>
  );
}
