import FullTooltip from "@components/FullTooltip";
import { Label } from "@components/Label";
import { IconInfoCircle } from "@tabler/icons-react";
import { cn } from "@utils/helpers";
import { isLocalDev, isProduction } from "@utils/netbird";
import { isEmpty } from "lodash";
import { GlobeIcon } from "lucide-react";
import React, { useMemo } from "react";
import RoundedFlag from "@/assets/countries/RoundedFlag";
import { useCountries } from "@/contexts/CountryProvider";
import { ActivityEvent } from "@/interfaces/ActivityEvent";
import { TransText } from "@/i18n/trans-text";

type Props = {
  event: ActivityEvent;
};

export default function ActivityDescription({ event }: Props) {
  const m = event.meta;
  const meta = useMemo(() => {
    if (event.meta) {
      return Object.keys(event.meta)
        .map((key) => {
          if (!event.meta[key]) return;
          if (key == "peer_groups") return;
          if (key.includes("id")) return;
          if (key.includes("time")) return;
          return {
            key,
            value: event.meta[key],
          };
        })
        .filter((item) => item !== undefined);
    }
  }, [event.meta]);

  if (!m) return null;

  /**
   * Setup Key
   */

  if (event.activity_code == "setupkey.revoke")
    return (
      <div className={"inline"}>
        <TransText>Setup-Key</TransText> <Value> {m.name}</Value> <TransText>with key</TransText> <Value>{m.key}</Value> <TransText>was revoked</TransText>
      </div>
    );

  if (event.activity_code == "setupkey.delete")
    return (
      <div className={"inline"}>
        <TransText>Setup-Key</TransText> <Value> {m.name}</Value> <TransText>with key</TransText> <Value>{m.key}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "setupkey.add")
    return (
      <div className={"inline"}>
        <TransText>Setup-Key</TransText> <Value>{m.name}</Value> <TransText>with key</TransText> <Value>{m.key}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "peer.setupkey.add")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> <TransText>was added with the NetBird IP</TransText> <Value>{m.ip}</Value> <TransText>using the setup key</TransText>{" "}
        <Value>{m.setup_key_name}</Value>
      </div>
    );

  if (event.activity_code == "setupkey.group.delete")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.group}</Value> <TransText>was removed from the</TransText>{" "}
        <Value>{m.setupkey}</Value> <TransText>setup key</TransText>
      </div>
    );

  if (event.activity_code == "setupkey.group.add")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.group}</Value> <TransText>was added to the</TransText>{" "}
        <Value>{m.setupkey}</Value> <TransText>setup key</TransText>
      </div>
    );

  /**
   * Dashboard
   */
  if (event.activity_code == "dashboard.login")
    return (
      <div className={"inline"}>
        <Value>{m.username}</Value> <TransText>logged in to the dashboard</TransText>
      </div>
    );

  /**
   * Policy
   */

  if (event.activity_code == "policy.update")
    return (
      <div className={"inline"}>
        <TransText>Policy</TransText> <Value>{m.name}</Value> <TransText>has been updated</TransText>
      </div>
    );

  if (event.activity_code == "policy.delete")
    return (
      <div className={"inline"}>
        <TransText>Policy</TransText> <Value>{m.name}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "policy.add")
    return (
      <div className={"inline"}>
        <TransText>Policy</TransText> <Value>{m.name}</Value> <TransText>was created</TransText>
      </div>
    );

  /**
   * Route
   */

  if (event.activity_code == "route.delete") {
    let hasDomains = m?.domains && m?.domains.length > 0;
    return (
      <div className={"inline"}>
        <TransText>Route</TransText> <Value>{m.name}</Value> <TransText>with the</TransText> {hasDomains ? "domain(s)" : ""}{" "}
        <Value>{hasDomains ? m?.domains : m.network_range}</Value>{" "}
        {hasDomains ? "" : "range"} <TransText>was deleted</TransText>
      </div>
    );
  }

  if (event.activity_code == "route.update") {
    let hasDomains = m?.domains && m?.domains.length > 0;
    return (
      <div className={"inline"}>
        <TransText>Route</TransText> <Value>{m.name}</Value> <TransText>with the</TransText> {hasDomains ? "domain(s)" : ""}{" "}
        <Value>{hasDomains ? m?.domains : m.network_range}</Value>{" "}
        {hasDomains ? "" : "range"} <TransText>was updated</TransText>
      </div>
    );
  }

  if (event.activity_code == "route.add") {
    let hasDomains = m?.domains && m?.domains.length > 0;
    return (
      <div className={"inline"}>
        <TransText>Route</TransText> <Value>{m.name}</Value> <TransText>with the</TransText> {hasDomains ? "domain(s)" : ""}{" "}
        <Value>{hasDomains ? m?.domains : m.network_range}</Value>{" "}
        {hasDomains ? "" : "range"} <TransText>was created</TransText>
      </div>
    );
  }

  /**
   * User
   */

  if (event.activity_code == "user.peer.delete")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> <TransText>with NetBird IP</TransText> <Value>{m.ip}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "user.peer.add")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> <TransText>was added with the NetBird IP</TransText> <Value>{m.ip}</Value>
      </div>
    );

  if (event.activity_code == "user.peer.update")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> <TransText>with NetBird IP</TransText> <Value>{m.ip}</Value> <TransText>was updated</TransText>
      </div>
    );

  if (event.activity_code == "user.join")
    return (
      <div className={"inline"}>
        <TransText>User</TransText> <Value>{m.username}</Value> <TransText>joined NetBird</TransText>
      </div>
    );

  if (event.activity_code == "user.invite")
    return (
      <div className={"inline"}>
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>{" "}
        <TransText>was invited.</TransText>
      </div>
    );

  if (event.activity_code == "user.create")
    return (
      <div className={"inline"}>
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>{" "}
        <TransText>was created by</TransText> <Value>{event?.initiator_name || "NetBird"}</Value>
      </div>
    );

  if (event.activity_code == "user.group.add")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{event.meta.group}</Value> <TransText>was added to user</TransText>{" "}
        <Value>{event.meta.username}</Value>
      </div>
    );

  if (event.activity_code == "user.block")
    return (
      <div className={"inline"}>
        <TransText>User</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> <TransText>was blocked</TransText>
      </div>
    );

  if (event.activity_code == "user.unblock")
    return (
      <div className={"inline"}>
        <TransText>User</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> <TransText>was unblocked</TransText>
      </div>
    );

  if (event.activity_code == "user.delete")
    return (
      <div className={"inline"}>
        <TransText>User</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "user.group.delete")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{event.meta.group}</Value> <TransText>was removed from user</TransText>{" "}
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.role.update")
    return (
      <div className={"inline"}>
        <TransText>Role</TransText> <Value>{event.meta.role}</Value> <TransText>was updated of user</TransText>{" "}
        <Value>{event.meta.username}</Value> <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.approve")
    return (
      <div className={"inline"}>
        <TransText>User</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> <TransText>was approved</TransText>
      </div>
    );

  if (event.activity_code == "user.reject")
    return (
      <div className={"inline"}>
        <TransText>User</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value> <TransText>was rejected</TransText>
      </div>
    );

  if (event.activity_code == "user.password.change")
    return (
      <div className={"inline"}>
        <TransText>Password was changed for user</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  /**
   * User Invite Link
   */

  if (event.activity_code == "user.invite.link.create")
    return (
      <div className={"inline"}>
        <TransText>Invite link was created for</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.invite.link.accept")
    return (
      <div className={"inline"}>
        <TransText>Invite link was accepted by</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.invite.link.regenerate")
    return (
      <div className={"inline"}>
        <TransText>Invite link was regenerated for</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  if (event.activity_code == "user.invite.link.delete")
    return (
      <div className={"inline"}>
        <TransText>Invite link was deleted for</TransText> <Value>{event.meta.username}</Value>{" "}
        <Value>{event.meta.email}</Value>
      </div>
    );

  /**
   * Service User
   */

  if (event.activity_code == "service.user.create")
    return (
      <div className={"inline"}>
        <TransText>Service user</TransText> <Value>{event.meta.name}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "service.user.delete")
    return (
      <div className={"inline"}>
        <TransText>Service user</TransText> <Value>{event.meta.name}</Value> <TransText>was deleted</TransText>
      </div>
    );

  /**
   * Peer
   */

  if (event.activity_code == "peer.group.delete")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.group}</Value> <TransText>was removed from the peer with the NetBird IP</TransText> <Value>{m.peer_ip}</Value>
      </div>
    );

  if (event.activity_code == "peer.group.add")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.group}</Value> <TransText>was added to the peer with the NetBird IP</TransText>{" "}
        <Value>{m.peer_ip}</Value>
      </div>
    );

  if (event.activity_code == "peer.login.expire") {
    return (
      <div className={"inline"}>
        <TransText>Login of the peer</TransText> <Value>{m.name}</Value> <TransText>expired</TransText>
        {m.reason && (
          <>
            {" "}
            <TransText>due to</TransText> <Value>{m.reason}</Value>
          </>
        )}
      </div>
    );
  }

  if (event.activity_code == "peer.ssh.disable")
    return (
      <div className={"inline"}>
        <TransText>SSH Server of peer</TransText> <Value>{m.name}</Value> <TransText>was disabled</TransText>
      </div>
    );

  if (event.activity_code == "peer.ssh.enable")
    return (
      <div className={"inline"}>
        <TransText>SSH Server of peer</TransText> <Value>{m.name}</Value> <TransText>was enabled</TransText>
      </div>
    );

  if (event.activity_code == "peer.login.expiration.disable")
    return (
      <div className={"inline"}>
        <TransText>Login expiration of peer</TransText> <Value>{m.name}</Value> <TransText>was disabled</TransText>
      </div>
    );

  if (event.activity_code == "peer.login.expiration.enable")
    return (
      <div className={"inline"}>
        <TransText>Login expiration of peer</TransText> <Value>{m.name}</Value> <TransText>was enabled</TransText>
      </div>
    );

  if (event.activity_code == "peer.rename")
    return (
      <div className={"inline"}>
        <TransText>Peer with the NetBird IP</TransText> <Value>{m.ip}</Value> <TransText>was renamed to</TransText>{" "}
        <Value>{m.name}</Value>
      </div>
    );

  if (event.activity_code == "peer.approve")
    return (
      <div className={"inline"}>
        <TransText>Peer with the NetBird IP</TransText> <Value>{m.ip}</Value> <TransText>was approved</TransText>
      </div>
    );

  if (event.activity_code == "peer.ip.update")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.name}</Value> <TransText>IP address was updated from</TransText>{" "}
        <Value>{m.old_ip}</Value> <TransText>to</TransText> <Value>{m.ip}</Value>
      </div>
    );

  if (event.activity_code == "peer.user.add")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.name}</Value> <PeerConnectionInfo meta={m} /> <TransText>was added with the NetBird IP</TransText> <Value>{m.ip}</Value>
      </div>
    );

  /**
   * Group
   */

  if (event.activity_code == "group.add")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.name}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "group.delete")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{event.meta.name}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "group.update")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{event.meta.old_name}</Value> <TransText>was renamed to</TransText>{" "}
        <Value>{event.meta.new_name}</Value>
      </div>
    );

  /**
   * Account
   */

  if (event.activity_code == "account.create")
    return (
      <div className={"inline"}>
        <Value>{event.initiator_name}</Value> <TransText>created an account</TransText>
      </div>
    );

  if (event.activity_code == "account.setting.peer.login.expiration.update")
    return <div className={"inline"}><TransText>Global login expiration was updated</TransText></div>;

  if (event.activity_code == "account.setting.peer.login.expiration.enable")
    return <div className={"inline"}><TransText>Global login expiration was enabled</TransText></div>;

  if (event.activity_code == "account.setting.peer.login.expiration.disable")
    return <div className={"inline"}><TransText>Global login expiration was disabled</TransText></div>;

  if (event.activity_code == "account.network.range.update")
    return (
      <div className={"inline"}>
        <TransText>Account network range was updated from</TransText>{" "}
        <Value>{m.old_network_range}</Value> <TransText>to</TransText>{" "}
        <Value>{m.new_network_range}</Value>
      </div>
    );

  /**
   * Nameserver
   */

  if (event.activity_code == "nameserver.group.add")
    return (
      <div className={"inline"}>
        <TransText>Nameserver</TransText> <Value>{event.meta.name}</Value> <TransText>was added</TransText>
      </div>
    );

  if (event.activity_code == "nameserver.group.delete")
    return (
      <div className={"inline"}>
        <TransText>Nameserver</TransText> <Value>{event.meta.name}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "nameserver.group.update")
    return (
      <div className={"inline"}>
        <TransText>Nameserver</TransText> <Value>{event.meta.name}</Value> <TransText>was updated</TransText>
      </div>
    );

  /**
   * Personal Access Token
   */

  if (event.activity_code == "personal.access.token.create")
    return (
      <div className={"inline"}>
        <TransText>Access token</TransText> <Value>{event.meta.name}</Value> <TransText>for user</TransText>{" "}
        <Value>{event.meta.username}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "personal.access.token.delete")
    return (
      <div className={"inline"}>
        <TransText>Access token</TransText> <Value>{event.meta.name}</Value> <TransText>for user</TransText>{" "}
        <Value>{event.meta.username}</Value> <TransText>was deleted</TransText>
      </div>
    );

  /**
   * Integration
   */

  if (event.activity_code == "integration.create") {
    if (!event.meta.platform) return "Integration created";
    return (
      <div className={"inline"}>
        <Value className={"capitalize"}>{event.meta.platform}</Value>{" "}
        <TransText>integration created</TransText>
      </div>
    );
  }

  if (event.activity_code == "integration.delete") {
    if (!event.meta.platform) return "Integration deleted";
    return (
      <div className={"inline"}>
        <Value className={"capitalize"}>{event.meta.platform}</Value>{" "}
        <TransText>integration deleted</TransText>
      </div>
    );
  }

  if (event.activity_code == "integration.update") {
    if (!event.meta.platform) return "Integration updated";
    return (
      <div className={"inline"}>
        <Value className={"capitalize"}>{event.meta.platform}</Value>{" "}
        <TransText>integration updated</TransText>
      </div>
    );
  }

  /**
   * DNS
   */

  if (event.activity_code == "dns.setting.disabled.management.group.add")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{event.meta.group}</Value> <TransText>was added to disabled DNS group setting</TransText>
      </div>
    );

  if (event.activity_code == "dns.setting.disabled.management.group.delete")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{event.meta.group}</Value> <TransText>was removed from disabled DNS group setting</TransText>
      </div>
    );

  /**
   * Posture Checks
   */

  if (event.activity_code == "posture.check.updated")
    return (
      <div className={"inline"}>
        <TransText>Posture check</TransText> <Value> {m.name}</Value> <TransText>was updated</TransText>
      </div>
    );

  if (event.activity_code == "posture.check.created")
    return (
      <div className={"inline"}>
        <TransText>Posture check</TransText> <Value> {m.name}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "posture.check.deleted")
    return (
      <div className={"inline"}>
        <TransText>Posture check</TransText> <Value> {m.name}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "transferred.owner.role")
    return <div className={"inline"}><TransText>Owner role was transferred</TransText></div>;

  /**
   * EDR
   */
  if (event.activity_code == "integrated-validator.api.created")
    return (
      <div className={"inline"}>
        <Value>{m?.platform}</Value> <TransText>integration created</TransText>
      </div>
    );

  if (event.activity_code == "integrated-validator.api.updated")
    return (
      <div className={"inline"}>
        <Value>{m?.platform}</Value> <TransText>integration updated</TransText>
      </div>
    );

  if (event.activity_code == "integrated-validator.api.deleted")
    return (
      <div className={"inline"}>
        <Value>{m?.platform}</Value> <TransText>integration deleted</TransText>
      </div>
    );

  if (event.activity_code == "integrated-validator.host-check.approved")
    return (
      <div className={"inline"}>
        <TransText>Peer approved by</TransText> <Value>{m?.platform}</Value> <TransText>integration</TransText>
      </div>
    );

  if (event.activity_code == "integrated-validator.host-check.denied")
    return (
      <div className={"inline"}>
        <TransText>Peer rejected by</TransText> <Value>{m?.platform}</Value> <TransText>integration</TransText>
      </div>
    );

  if (event.activity_code == "integrated-validator.peer.compliance-bypassed")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m?.name}</Value> <TransText>with the NetBird IP</TransText> <Value>{m?.ip}</Value>{" "}
        <TransText>compliance bypassed for</TransText> <Value>{m?.platform}</Value> <TransText>integration</TransText>
        {m?.original_reason && (
          <>
            {" "}
            <TransText>(original non-compliant reason:</TransText> <Value>{m?.original_reason}</Value><TransText>)</TransText>
          </>
        )}
      </div>
    );

  if (
    event.activity_code == "integrated-validator.peer.compliance-bypass-revoked"
  )
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m?.name}</Value> <TransText>with the NetBird IP</TransText> <Value>{m?.ip}</Value>{" "}
        <TransText>compliance bypass revoked for</TransText> <Value>{m?.platform}</Value> <TransText>integration</TransText>
      </div>
    );

  /**
   * Resource
   */
  if (event.activity_code == "resource.group.add")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.name}</Value> <TransText>added to resource</TransText>{"  "}
        <Value>{m.resource_name}</Value>
      </div>
    );

  if (event.activity_code == "resource.group.delete")
    return (
      <div className={"inline"}>
        <TransText>Group</TransText> <Value>{m.name}</Value> <TransText>removed from resource</TransText>{"  "}
        <Value>{m.resource_name}</Value>
      </div>
    );

  /**
   * Reverse Proxy
   */

  if (event.activity_code == "service.peer.expose")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.peer_name}</Value> <TransText>exposed service</TransText>{" "}
        <Value>{m.domain}</Value> <TransText>with auth</TransText>{" "}
        <Value>{m.auth ? "Enabled" : "Disabled"}</Value>
      </div>
    );

  if (event.activity_code == "service.peer.unexpose")
    return (
      <div className={"inline"}>
        <TransText>Peer</TransText> <Value>{m.peer_name}</Value> <TransText>unexposed service</TransText>{" "}
        <Value>{m.domain}</Value>
      </div>
    );

  if (event.activity_code == "service.peer.expose.expire")
    return (
      <div className={"inline"}>
        <TransText>Service</TransText> <Value>{m.domain}</Value> <TransText>exposed by peer</TransText>{" "}
        <Value>{m.peer_name}</Value> <TransText>was removed due to renewal expiration</TransText>
      </div>
    );

  /**
   * Networks
   */

  if (event.activity_code == "network.resource.create")
    return (
      <div className={"inline"}>
        <TransText>Resource</TransText> <Value>{m.name}</Value> <TransText>created for network</TransText>{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.resource.update")
    return (
      <div className={"inline"}>
        <TransText>Resource</TransText> <Value>{m.name}</Value> <TransText>updated for network</TransText>{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.resource.delete")
    return (
      <div className={"inline"}>
        <TransText>Resource</TransText> <Value>{m.name}</Value> <TransText>deleted from network</TransText>{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.router.create")
    return (
      <div className={"inline"}>
        <TransText>Routing peer created for network</TransText>{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.router.delete")
    return (
      <div className={"inline"}>
        <TransText>Routing peer deleted from network</TransText>{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.router.update")
    return (
      <div className={"inline"}>
        <TransText>Routing peer updated from network</TransText>{"  "}
        <Value>{m.network_name}</Value>
      </div>
    );

  if (event.activity_code == "network.create")
    return (
      <div className={"inline"}>
        <TransText>Network with name</TransText> <Value>{m.name}</Value> <TransText>created</TransText>
      </div>
    );

  if (event.activity_code == "network.delete")
    return (
      <div className={"inline"}>
        <TransText>Network with name</TransText> <Value>{m.name}</Value> <TransText>deleted</TransText>
      </div>
    );

  if (event.activity_code == "network.update")
    return (
      <div className={"inline"}>
        <TransText>Network with name</TransText> <Value>{m.name}</Value> <TransText>updated</TransText>
      </div>
    );

  /**
   * Jobs
   */

  if (event.activity_code == "peer.job.create")
    return (
      <div className={"inline"}>
        <TransText>Remote job</TransText> <Value>{m.job_type}</Value> <TransText>created for peer</TransText>{" "}
        <Value>{m.for_peer_name}</Value>
      </div>
    );

  /**
   * Flow Settings
   */

  if (event.activity_code == "account.settings.extra.flow.group.remove")
    return (
      <div className={"inline"}>
        <TransText>Limit traffic event group</TransText> <Value>{m.group_name}</Value> <TransText>removed</TransText>
      </div>
    );

  if (event.activity_code == "account.settings.extra.flow.group.add")
    return (
      <div className={"inline"}>
        <TransText>Limit traffic event group</TransText> <Value>{m.group_name}</Value> <TransText>added</TransText>
      </div>
    );

  /**
   * Identity Provider
   */

  if (event.activity_code == "identityprovider.create")
    return (
      <div className={"inline"}>
        <TransText>Identity provider</TransText> <Value>{m.name}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "identityprovider.update")
    return (
      <div className={"inline"}>
        <TransText>Identity provider</TransText> <Value>{m.name}</Value> <TransText>was updated</TransText>
      </div>
    );

  if (event.activity_code == "identityprovider.delete")
    return (
      <div className={"inline"}>
        <TransText>Identity provider</TransText> <Value>{m.name}</Value> <TransText>was deleted</TransText>
      </div>
    );

  /**
   * Reverse Proxy
   */

  if (event.activity_code == "service.create")
    return (
      <div className={"inline"}>
        <TransText>Service</TransText> <Value>{m.domain}</Value> <TransText>in cluster</TransText>{" "}
        <Value>{m.proxy_cluster}</Value> <TransText>was created with authentication</TransText>{" "}
        <Value>{m.auth ? "Enabled" : "Disabled"}</Value>
      </div>
    );

  if (event.activity_code == "service.update")
    return (
      <div className={"inline"}>
        <TransText>Service</TransText> <Value>{m.domain}</Value> <TransText>in cluster</TransText>{" "}
        <Value>{m.proxy_cluster}</Value> <TransText>was updated with authentication</TransText>{" "}
        <Value>{m.auth ? "Enabled" : "Disabled"}</Value>
      </div>
    );

  if (event.activity_code == "service.delete")
    return (
      <div className={"inline"}>
        <TransText>Service</TransText> <Value>{m.domain}</Value> <TransText>in cluster</TransText>{" "}
        <Value>{m.proxy_cluster}</Value> <TransText>was deleted</TransText>
      </div>
    );

  /**
   * Distributor
   */

  if (event.activity_code == "reseller.msp.created")
    return (
      <div className={"inline"}>
        <TransText>Customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value> <TransText>was created</TransText>
      </div>
    );

  if (event.activity_code == "reseller.activated")
    return <div className={"inline"}><TransText>Distributor account was activated</TransText></div>;

  if (event.activity_code == "reseller.msp.deleted")
    return (
      <div className={"inline"}>
        <TransText>Customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value> <TransText>was deleted</TransText>
      </div>
    );

  if (event.activity_code == "reseller.msp.unlinked")
    return (
      <div className={"inline"}>
        <TransText>Customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value> <TransText>was unlinked</TransText>
      </div>
    );

  if (event.activity_code == "reseller.msp.invite.requested")
    return (
      <div className={"inline"}>
        <TransText>Invite requested for customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value>
      </div>
    );

  if (event.activity_code == "reseller.msp.invite.accepted")
    return (
      <div className={"inline"}>
        <TransText>Invite accepted by customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value>
      </div>
    );

  if (event.activity_code == "reseller.msp.invite.declined")
    return (
      <div className={"inline"}>
        <TransText>Invite declined by customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value>
      </div>
    );

  if (event.activity_code == "reseller.msp.updated")
    return (
      <div className={"inline"}>
        <TransText>Customer</TransText> <Value>{m.msp_name}</Value> <TransText>with domain</TransText>{" "}
        <Value>{m.msp_domain}</Value> <TransText>was updated</TransText>
      </div>
    );

  return (
    <div className={"flex gap-2.5 items-center"}>
      <span className={"mb-[1px]"}>{event.activity}</span>

      {isLocalDev() && !isProduction() && (
        <FullTooltip
          content={
            <div className={"pb-1"}>
              <Label className={"mb-3"}><TransText>Activity Code</TransText></Label>
              <Value>{event.activity_code}</Value>
              <Label className={"my-3"}><TransText>Meta</TransText></Label>
              {meta &&
                meta.map((item) => (
                  <React.Fragment key={item?.key}>
                    <div className={"inline"}>
                      <Value>
                        {item?.key} = {item?.value}
                      </Value>
                    </div>
                  </React.Fragment>
                ))}
            </div>
          }
        >
          <IconInfoCircle className={"text-nb-gray-500"} size={16} />
        </FullTooltip>
      )}
    </div>
  );
}

function Value({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return children ? (
    <span
      className={cn(
        "text-nb-gray-200 inline-flex gap-1 items-center max-h-[22px] font-medium bg-nb-gray-900 py-[3px] text-[11px] px-[5px] border border-nb-gray-800 rounded-[4px]",
        className,
      )}
    >
      {children}
    </span>
  ) : null;
}

function PeerConnectionInfo({ meta }: { meta: any }) {
  const hasMeta =
    !isEmpty(meta?.location_country_code) ||
    !isEmpty(meta?.location_connection_ip);
  const { countries } = useCountries();

  const countryText = useMemo(() => {
    if (!countries) return "Unknown";
    const country = countries.find(
      (c) => c.country_code === meta?.location_country_code,
    );
    if (!country) return "Unknown";
    if (!meta?.location_city_name) return country.country_name;
    return `${country.country_name}, ${meta?.location_city_name}`;
  }, [countries, meta]);

  return hasMeta ? (
    <>
      {" "}
      from{" "}
      {meta?.location_connection_ip && (
        <Value>{meta?.location_connection_ip}</Value>
      )}{" "}
      {meta?.location_country_code && (
        <Value>
          {isEmpty(meta?.location_country_code) ? (
            <GlobeIcon size={9} className={"text-nb-gray-300"} />
          ) : (
            <RoundedFlag country={meta?.location_country_code} size={9} />
          )}
          {countryText}
        </Value>
      )}
    </>
  ) : null;
}
