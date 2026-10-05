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
import zhMap from "@/i18n/zh-map";

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
        title={zhMap["Connect NetBird with Okta"] || "Connect NetBird with Okta"}
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
            <TransText>Required Permissions</TransText>
          </div>
          <p className={"mt-2 !text-nb-gray-300 !leading-[1.5]"}>
            <TransText>Ensure that you have an</TransText>{" "}
            <span className={"text-nb-gray-100 font-semibold"}>
              <TransText>Okta user account</TransText>
            </span>{" "}
            <TransText>with the following</TransText>{" "}
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
              <TransText>Add Okta applications</TransText>
            </div>
            <div
              className={
                "py-2 px-6 flex items-center gap-2 rounded-md w-full justify-center bg-nb-gray-930/0 text-nb-gray-200"
              }
            >
              <Settings2 size={14} className={"text-sky-500"} />
              <TransText>Configure Okta applications</TransText>
            </div>
          </div>
        </div>
      )}

      {step == 1 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <LogInIcon size={20} />
            <TransText>Configure SSO in Okta</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p className={"font-normal"}>
                <TransText>Access the Okta dashboard and navigate to</TransText>{" "}
                <Mark>{"Applications > Applications"}</Mark><TransText>, selecting the previously installed</TransText> <Mark><TransText>NetBird</TransText></Mark> <TransText>application</TransText>
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                <TransText>Go to</TransText> <Mark>{"Sign On > Settings"}</Mark> <TransText>and select</TransText>{" "}
                <Mark><TransText>Edit</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p className={"font-normal"}>
                <TransText>In the</TransText> <Mark><TransText>Credentials Details</TransText></Mark> <TransText>section, change the</TransText>
                <Mark><TransText>Application username format</TransText></Mark> <TransText>to</TransText> <Mark><TransText>Email</TransText></Mark>{" "}
                <TransText>and select</TransText> <Mark><TransText>Save</TransText></Mark>
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
            <TransText>Enable Okta SCIM in NetBird</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                <TransText>From the Okta dashboard, navigate to</TransText>{" "}
                <Mark>{"Applications > Applications"}</Mark> <TransText>and select the</TransText>{" "}
                <Mark><TransText>NetBird</TransText></Mark> <TransText>application</TransText>
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                <TransText>Under the</TransText> <Mark><TransText>Provisioning</TransText></Mark> <TransText>tab, choose</TransText>{" "}
                <Mark><TransText>Integration</TransText></Mark><TransText>, then select</TransText>{" "}
                <Mark><TransText>Configure API Integration</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3}>
              <p className={"font-normal"}>
                <TransText>Opt to</TransText> <Mark><TransText>Enable API integration</TransText></Mark> <TransText>and insert this token into the</TransText> <Mark><TransText>API Token</TransText></Mark> <TransText>field</TransText>
              </p>
              <MinimalList
                data={[{ label: "Authorization (Bearer)", value: authToken }]}
              />
            </Steps.Step>
            <Steps.Step step={4} line={false}>
              <p className={"font-normal"}>
                <TransText>Click</TransText> <Mark><TransText>Test API Credentials</TransText></Mark> <TransText>to verify the SCIM connection, then select</TransText> <Mark><TransText>Save</TransText></Mark>
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 3 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <Box size={20} />
            <TransText>Configure SCIM provisioning to NetBird</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                <TransText>Go to the</TransText> <Mark>{"Provisioning > Settings > To App"}</Mark> <TransText>and click</TransText> <Mark><TransText>Edit</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={2} line={false}>
              <p className={"font-normal"}>
                <TransText>Enable</TransText> <Mark><TransText>Create Users</TransText></Mark>,{" "}
                <Mark><TransText>Update User Attributes</TransText></Mark><TransText>, and</TransText>{" "}
                <Mark><TransText>Deactivate Users</TransText></Mark> <TransText>and click</TransText> <Mark><TransText>Save</TransText></Mark>
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
            <TransText>Sync Users to NetBird</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                <TransText>Go to the</TransText> <Mark><TransText>Assignments</TransText></Mark> <TransText>tab, select the</TransText>{" "}
                <Mark><TransText>Assign</TransText></Mark> <TransText>and click</TransText> <Mark><TransText>Assign to Groups</TransText></Mark>
              </p>
              <Lightbox image={oktaGroupsAssignments} />
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                <TransText>Select the groups you want to provision, and then select</TransText>{" "}
                <Mark><TransText>Assign</TransText></Mark> <TransText>and click</TransText> <Mark><TransText>Save and Go Back</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p className={"font-normal"}>
                <TransText>Select</TransText> <Mark><TransText>Done</TransText></Mark> <TransText>after you have finished assigning groups. At this point, all members of the groups assigned to the application will be synced to NetBird.</TransText>
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 5 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <FolderGit2 size={20} />
            <TransText>Sync Groups to NetBird</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                <TransText>Go to the</TransText> <Mark><TransText>Push Groups</TransText></Mark> <TransText>tab, select</TransText>{" "}
                <Mark><TransText>Push Groups</TransText></Mark> <TransText>and click</TransText>{" "}
                <Mark><TransText>Find groups by name</TransText></Mark>
              </p>
              <Lightbox image={oktaSyncGroups} />
            </Steps.Step>
            <Steps.Step step={2} line={false}>
              <p className={"font-normal"}>
                <TransText>Search groups to push and then click</TransText> <Mark><TransText>Save</TransText></Mark><TransText>. The selected groups will then be synced to NetBird.</TransText>
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
            <TransText>Continue</TransText>
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
            <TransText>Back</TransText>
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
            <TransText>Estimated setup time:</TransText>
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
        title={zhMap["Connect NetBird with Okta"] || "Connect NetBird with Okta"}
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
            <TransText>Required Permissions</TransText>
          </div>
          <p className={"mt-2 !text-nb-gray-300 !leading-[1.5]"}>
            <TransText>Ensure that you have an</TransText>{" "}
            <span className={"text-nb-gray-100 font-semibold"}>
              <TransText>Okta user account</TransText>
            </span>{" "}
            <TransText>with the following</TransText>{" "}
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
              <TransText>Add Okta applications</TransText>
            </div>
            <div
              className={
                "py-2 px-6 flex items-center gap-2 rounded-md w-full justify-center bg-nb-gray-930/0 text-nb-gray-200"
              }
            >
              <Settings2 size={14} className={"text-sky-500"} />
              <TransText>Configure Okta applications</TransText>
            </div>
          </div>
        </div>
      )}

      {step == 1 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <Box size={20} />
            <TransText>Install NetBird application for Okta</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p>
                <TransText>Navigate to</TransText>{" "}
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
                <TransText>Click</TransText> <Mark>+ Add Integration</Mark> <TransText>and then</TransText> <Mark><TransText>Done</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3} line={false}>
              <p>
                <TransText>After installing the application go to the</TransText>{" "}
                <Mark><TransText>Assignments</TransText></Mark> <TransText>tab, select the</TransText> <Mark><TransText>Assign</TransText></Mark> <TransText>and click</TransText> <Mark><TransText>Assign to People</TransText></Mark> <TransText>and assign your user to the application</TransText>
              </p>
            </Steps.Step>
          </Steps>
        </div>
      )}

      {step == 2 && (
        <div className={"px-8 py-3 flex flex-col gap-0 mt-4"}>
          <p className={"font-medium flex gap-3 items-center text-base"}>
            <MailIcon size={20} />
            <TransText>Share your Okta details with NetBird</TransText>
          </p>
          <Steps>
            <Steps.Step step={1}>
              <p className={"font-normal"}>
                <TransText>Click on the</TransText> <Mark>{"Sign On"}</Mark> <TransText>tab and take note</TransText> <br />
                <TransText>of the</TransText> <Mark><TransText>Client ID</TransText></Mark> <TransText>and</TransText> <Mark><TransText>Client secret</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={2}>
              <p className={"font-normal"}>
                <TransText>Under your user profile, take note of your</TransText>{" "}
                <Mark><TransText>Okta account domain</TransText></Mark>
              </p>
            </Steps.Step>
            <Steps.Step step={3}>
              <p className={"font-normal"}>
                <TransText>Share your</TransText> <Mark><TransText>Client ID</TransText></Mark> <Mark><TransText>Client secret</TransText></Mark>{" "}
                <Mark><TransText>Okta account domain</TransText></Mark> <TransText>and your</TransText> {"user's"}
                <Mark><TransText>Primary email domain</TransText></Mark> <TransText>with the NetBird team</TransText>
              </p>
            </Steps.Step>
            <Steps.Step step={4} line={false}>
              <p className={"font-normal"}>
                <TransText>Once the NetBird team has enabled the authentication for your account you will receive an email. After that you can visit</TransText>{" "}
                <InlineLink href={"https://app.netbird.io"}>
                  app.netbird.io
                </InlineLink>{" "}
                <TransText>and authenticate using your Okta’s credentials</TransText>
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
                <TransText>You can use</TransText>{" "}
                <InlineLink
                  href={"mailto:support@netbird.io"}
                  className={"inline !text-netbird-500 font-medium"}
                >
                  {" "}
                  1Password
                </InlineLink>{" "}
                <TransText>or any other secure sharing tool to share your Okta details with the NetBird team. If you need help, please contact us at</TransText>{" "}
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
            <TransText>Back</TransText>
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
            <TransText>Estimated setup time:</TransText>
            <span className={"font-medium"}> 5 Minutes</span>
          </div>
        </div>
      )}
    </ModalContent>
  );
}
