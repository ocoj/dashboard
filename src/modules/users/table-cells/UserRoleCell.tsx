import Badge from "@components/Badge";
import { cn } from "@utils/helpers";
import {
  Cog,
  CreditCardIcon,
  EyeIcon,
  GaugeIcon,
  NetworkIcon,
  User2,
} from "lucide-react";
import React from "react";
import AgentNetworkIcon from "@/assets/icons/AgentNetworkIcon";
import NetBirdIcon from "@/assets/icons/NetBirdIcon";
import { Role, User } from "@/interfaces/User";
import { TransText } from "@/i18n/trans-text";

type Props = {
  user: User;
};

export default function UserRoleCell({ user }: Readonly<Props>) {
  const role = user.role;

  return (
    <div className={cn("flex gap-3 items-center text-nb-gray-200")}>
      <Badge variant={role == "owner" ? "netbird" : "gray"}>
        {role === Role.User && (
          <>
            <User2 size={14} />
            <TransText>User</TransText>
          </>
        )}
        {role === Role.Admin && (
          <>
            <Cog size={14} />
            <TransText>Admin</TransText>
          </>
        )}
        {role === Role.Owner && (
          <>
            <NetBirdIcon size={14} />
            <TransText>Owner</TransText>
          </>
        )}
        {role === Role.BillingAdmin && (
          <>
            <CreditCardIcon size={14} />
            <TransText>Billing Admin</TransText>
          </>
        )}
        {role === Role.Auditor && (
          <>
            <EyeIcon size={14} />
            <TransText>Auditor</TransText>
          </>
        )}
        {role === Role.NetworkAdmin && (
          <>
            <NetworkIcon size={14} />
            <TransText>Network Admin</TransText>
          </>
        )}
        {role === Role.AgentNetworkAdmin && (
          <>
            <AgentNetworkIcon size={14} />
            <TransText>Agent Network Admin</TransText>
          </>
        )}
        {role === Role.UsageViewer && (
          <>
            <GaugeIcon size={14} />
            <TransText>Usage Viewer</TransText>
          </>
        )}
      </Badge>
    </div>
  );
}
