import Breadcrumbs from "@components/Breadcrumbs";
import Button from "@components/Button";
import FancyToggleSwitch from "@components/FancyToggleSwitch";
import HelpText from "@components/HelpText";
import InlineLink from "@components/InlineLink";
import { Input } from "@components/Input";
import { Label } from "@components/Label";
import { notify } from "@components/Notification";
import { PeerGroupSelector } from "@components/PeerGroupSelector";
import {
  SelectDropdown,
  SelectOption,
} from "@components/select/SelectDropdown";
import { Callout } from "@components/Callout";
import { useHasChanges } from "@hooks/useHasChanges";
import * as Tabs from "@radix-ui/react-tabs";
import { useApiCall } from "@utils/api";
import { cn, validator } from "@utils/helpers";
import {
  AlertTriangle,
  ClockFadingIcon,
  ExternalLinkIcon,
  MonitorSmartphoneIcon,
  RefreshCcw,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import AgentNetworkIcon from "@/assets/icons/AgentNetworkIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { Account } from "@/interfaces/Account";
import { SmallBadge } from "@components/ui/SmallBadge";
import ReverseProxyIcon from "@/assets/icons/ReverseProxyIcon";
import { useAgentNetworkMode } from "@/modules/agent-network/useAgentNetworkMode";
import useGroupHelper from "@/modules/groups/useGroupHelper";
import { useGroups } from "@/contexts/GroupsProvider";
import { TransText } from "@/i18n/trans-text";
import { SkeletonSettings } from "@components/skeletons/SkeletonSettings";

type Props = {
  account: Account;
};

const latestOrCustomVersion = [
  {
    label: "Disabled",
    value: "disabled",
  },
  {
    label: "Latest Version",
    value: "latest",
  },
  {
    label: "Custom Version",
    value: "custom",
  },
] as SelectOption[];

export default function ClientSettingsTab({ account }: Readonly<Props>) {
  const { isLoading: isGroupsLoading } = useGroups();

  return isGroupsLoading ? (
    <SkeletonSettings />
  ) : (
    <ClientSettingsTabContent account={account} />
  );
}

function ClientSettingsTabContent({ account }: Readonly<Props>) {
  const { permission } = usePermissions();
  const { enabled: agentNetworkEnabled } = useAgentNetworkMode();

  const { mutate } = useSWRConfig();
  const saveRequest = useApiCall<Account>("/accounts/" + account.id, true);

  const [lazyConnection, setLazyConnection] = useState(
    account.settings?.lazy_connection_enabled ?? false,
  );

  const [agentNetworkOnly, setAgentNetworkOnly] = useState(
    account.settings?.agent_network_only ?? false,
  );

  const autoUpdateSetting = account.settings?.auto_update_version;
  const isAutoUpdateEnabled =
    !!autoUpdateSetting && autoUpdateSetting !== "disabled";
  const isCustomVersion = validator.isValidVersion(autoUpdateSetting);
  const [autoUpdateMethod, setAutoUpdateMethod] = useState(
    isAutoUpdateEnabled ? (isCustomVersion ? "custom" : "latest") : "disabled",
  );

  const [autoUpdateCustomVersion, setAutoUpdateCustomVersion] = useState(
    isCustomVersion ? autoUpdateSetting : "",
  );

  const [autoUpdateAlways, setAutoUpdateAlways] = useState(
    account.settings?.auto_update_always ?? false,
  );

  const [peerExposeEnabled, setPeerExposeEnabled] = useState<boolean>(
    account?.settings?.peer_expose_enabled ?? false,
  );
  const [peerExposeGroups, setPeerExposeGroups, { save: saveGroups }] =
    useGroupHelper({
      initial: account.settings?.peer_expose_groups,
    });
  const peerExposeGroupNames = useMemo(
    () => peerExposeGroups.map((g) => g.name).sort(),
    [peerExposeGroups],
  );

  const { hasChanges, updateRef } = useHasChanges([
    autoUpdateMethod,
    autoUpdateCustomVersion,
    autoUpdateAlways,
    peerExposeEnabled,
    peerExposeGroupNames,
  ]);

  const handleUpdateMethodChange = (value: string) => {
    setAutoUpdateMethod(value);
    if (value === "disabled" || value === "latest") {
      setAutoUpdateCustomVersion("");
    }
  };

  const versionError = useMemo(() => {
    const msg = "Please enter a valid version, e.g., 0.2, 0.2.0, 0.2.0-alpha.1";
    if (autoUpdateCustomVersion == "") return "";
    if (autoUpdateCustomVersion == "-") return "";
    const validSemver = validator.isValidVersion(autoUpdateCustomVersion);
    if (!validSemver) return msg;
    return "";
  }, [autoUpdateCustomVersion]);

  const canSaveCustomVersion =
    autoUpdateCustomVersion !== "" &&
    autoUpdateMethod === "custom" &&
    versionError === "";

  const isSaveButtonDisabled = useMemo(() => {
    return (
      !hasChanges ||
      !permission.settings.update ||
      (autoUpdateMethod === "custom" && !canSaveCustomVersion) ||
      (peerExposeEnabled && peerExposeGroups.length === 0)
    );
  }, [
    hasChanges,
    permission.settings.update,
    autoUpdateMethod,
    canSaveCustomVersion,
    peerExposeEnabled,
    peerExposeGroups,
  ]);

  const saveChanges = async () => {
    const groups = await saveGroups();
    const peerExposeGroupIds = groups
      .map((group) => group.id)
      .filter(Boolean) as string[];

    notify({
      title: "Client Settings",
      description: `Client settings successfully updated.`,
      promise: saveRequest
        .put({
          id: account.id,
          settings: {
            ...account.settings,
            auto_update_version: autoUpdateCustomVersion || autoUpdateMethod,
            auto_update_always: autoUpdateAlways,
            peer_expose_enabled: peerExposeEnabled,
            peer_expose_groups: peerExposeGroupIds,
          },
        })
        .then(() => {
          mutate("/accounts");
          updateRef([
            autoUpdateMethod,
            autoUpdateCustomVersion,
            autoUpdateAlways,
            peerExposeEnabled,
            peerExposeGroupNames,
          ]);
        }),
      loadingMessage: "Updating client settings...",
    });
  };

  const toggleLazyConnection = async (toggle: boolean) => {
    notify({
      title: "Lazy Connections",
      description: `Lazy Connections successfully ${
        toggle ? "enabled" : "disabled"
      }.`,
      promise: saveRequest
        .put({
          id: account.id,
          settings: {
            ...account.settings,
            lazy_connection_enabled: toggle,
          },
        })
        .then(() => {
          setLazyConnection(toggle);
          mutate("/accounts");
        }),
      loadingMessage: "Updating Lazy Connections setting...",
    });
  };

  const toggleAgentNetworkOnly = async (toggle: boolean) => {
    notify({
      title: "Agent Network Focused View",
      description: `Agent Network focused view successfully ${
        toggle ? "enabled" : "disabled"
      }.`,
      promise: saveRequest
        .put({
          id: account.id,
          settings: {
            ...account.settings,
            agent_network_only: toggle,
          },
        })
        .then(() => {
          setAgentNetworkOnly(toggle);
          mutate("/accounts");
        }),
      loadingMessage: "Updating Agent Network focused view setting...",
    });
  };

  return (
    <Tabs.Content value={"clients"}>
      <div className={"p-default py-6 max-w-2xl"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/settings"}
            label={"Settings"}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings?tab=clients"}
            label={"Clients"}
            icon={<MonitorSmartphoneIcon size={14} />}
            active
          />
        </Breadcrumbs>
        <div className={"flex items-start justify-between"}>
          <h1><TransText>Clients</TransText></h1>
          <Button
            variant={"primary"}
            disabled={isSaveButtonDisabled}
            onClick={saveChanges}
            data-testid={"save-clients-settings"}
          >
            <TransText>Save Changes</TransText>
          </Button>
        </div>

        <div className={"flex flex-col gap-10 w-full mt-8"}>
          <div className={"flex flex-col relative"}>
            <Label>
              <RefreshCcw size={15} />
              <TransText>Automatic Updates</TransText>
              <SmallBadge
                text={"Beta"}
                variant={"sky"}
                className={"text-[9px] leading-none py-[3px] px-[5px]"}
                textClassName={"top-0"}
              />
            </Label>
            <HelpText>
              <TransText>Configure how NetBird clients receive update notifications. When enabled, users will be prompted to install the selected version. This requires at least NetBird</TransText>{" "}
              <span className={"text-white font-medium"}>v0.61.0</span>.{" "}
              <InlineLink
                href={"https://docs.netbird.io/manage/peers/auto-update"}
                target={"_blank"}
              >
                <TransText>Learn more</TransText>
                <ExternalLinkIcon size={12} />
              </InlineLink>
            </HelpText>
            <div className={"gap-4 items-center grid grid-cols-2"}>
              <SelectDropdown
                value={autoUpdateMethod}
                onChange={handleUpdateMethodChange}
                options={latestOrCustomVersion}
                data-testid="auto-update-method"
              />
              <Input
                value={autoUpdateCustomVersion}
                customPrefix={"Version"}
                placeholder={"e.g., 0.52.2"}
                error={versionError}
                errorTooltip={true}
                disabled={autoUpdateMethod !== "custom"}
                data-testid="auto-update-version-input"
                onChange={(v) => {
                  setAutoUpdateCustomVersion(v.target.value);
                }}
              />
            </div>
            <FancyToggleSwitch
              className={"mt-4"}
              value={autoUpdateAlways}
              onChange={setAutoUpdateAlways}
              data-testid="force-auto-updates"
              label={
                <>
                  <AlertTriangle size={15} className={"text-yellow-400"} />
                  <TransText>Force Automatic Updates</TransText>
                </>
              }
              helpText={<TransText>When enabled, updates are installed automatically in the background without user interaction.</TransText>}
              disabled={
                !permission.settings.update || autoUpdateMethod === "disabled"
              }
            />
            {autoUpdateAlways && autoUpdateMethod !== "disabled" && (
              <Callout
                className={"mt-3"}
                variant={"warning"}
                icon={
                  <AlertTriangle
                    size={14}
                    className={"shrink-0 relative top-[3px]"}
                  />
                }
              >
                <TransText>Enabling automatic updates will restart the NetBird client during updates, which can temporarily disrupt active connections. Use with caution in production environments.</TransText>
              </Callout>
            )}
          </div>

          <div>
            <div>
              <Label>
                <ReverseProxyIcon size={15} className={"fill-nb-gray-300"} />
                <TransText>Expose Services from CLI</TransText>
              </Label>
              <HelpText>
                <TransText>Allow peers to expose local services through the NetBird reverse proxy using the CLI.</TransText> <br />{" "}
                <TransText>This requires at least NetBird</TransText>{" "}
                <span className={"text-white font-medium"}>v0.66.0</span>.{" "}
                <InlineLink
                  href={
                    "https://docs.netbird.io/manage/reverse-proxy/expose-from-cli"
                  }
                  target={"_blank"}
                >
                  <TransText>Learn more</TransText>
                  <ExternalLinkIcon size={12} />
                </InlineLink>
              </HelpText>
            </div>

            <FancyToggleSwitch
              className={"mt-2"}
              value={peerExposeEnabled}
              onChange={setPeerExposeEnabled}
              data-testid="peer-expose"
              label={<TransText>Enable Peer Expose</TransText>}
              helpText={<TransText>When enabled, peers can expose local HTTP services accessible via a public URL.</TransText>}
              disabled={!permission.settings.update}
            />

            <div
              className={cn(
                "border border-nb-gray-900 border-t-0 rounded-b-md bg-nb-gray-940 px-[1.28rem] pt-3 pb-5 flex flex-col gap-4 mx-[0.25rem]",
                !peerExposeEnabled
                  ? "opacity-50 pointer-events-none"
                  : "bg-nb-gray-930/80",
              )}
            >
              <div className={"mt-2"}>
                <Label><TransText>Allowed peer groups</TransText></Label>
                <HelpText>
                  <TransText>Select which peer groups are allowed to expose services. At least one group is required.</TransText>
                </HelpText>
                <PeerGroupSelector
                  values={peerExposeGroups}
                  onChange={setPeerExposeGroups}
                  placeholder="Select peer groups..."
                  data-testid="peer-expose-groups-selector"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>
              <ClockFadingIcon size={15} />
              <TransText>Lazy Connections</TransText>
            </Label>

            <HelpText>
              <TransText>Instead of maintaining always-on connections, NetBird activates them on-demand based on activity or signaling. This requires NetBird client v0.50.1 or higher.</TransText>{" "}
              <InlineLink
                href={"https://docs.netbird.io/how-to/lazy-connection"}
                target={"_blank"}
              >
                <TransText>Learn more</TransText>
                <ExternalLinkIcon size={12} />
              </InlineLink>
            </HelpText>
            <FancyToggleSwitch
              className={"mt-2"}
              value={lazyConnection}
              onChange={toggleLazyConnection}
              data-testid="lazy-connections"
              label={<TransText>Enable Lazy Connections</TransText>}
              helpText={
                <TransText>
                  Allow to establish connections between peers only when
                  required. Changes will take effect after restarting the
                  clients.
                </TransText>
              }
              disabled={!permission.settings.update}
            />
          </div>

          {agentNetworkEnabled && (
            <div>
              <Label>
                <AgentNetworkIcon size={15} />
                <TransText>Agent Network</TransText>
              </Label>
              <HelpText>
                <TransText>Focus the dashboard on the Agent Network surface and hide sections that are not relevant for it, such as Networks, DNS and Reverse Proxy.</TransText>
              </HelpText>
              <FancyToggleSwitch
                className={"mt-2"}
                value={agentNetworkOnly}
                onChange={toggleAgentNetworkOnly}
                data-testid="agent-network-only"
                label={<TransText>Agent Network focused view</TransText>}
                helpText={<TransText>When enabled, the dashboard shows only the Agent Network related sections. Disable it to bring back the full dashboard.</TransText>}
                disabled={!permission.settings.update}
              />
            </div>
          )}
        </div>
      </div>
    </Tabs.Content>
  );
}
