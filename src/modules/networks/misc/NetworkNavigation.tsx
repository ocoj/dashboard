import SidebarItem from "@components/SidebarItem";
import * as React from "react";
import NetworkRoutesIcon from "@/assets/icons/NetworkRoutesIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { TransText } from "@/i18n/trans-text";

export const NetworkNavigation = () => {
  const { permission } = usePermissions();
  return (
    <SidebarItem
      icon={<NetworkRoutesIcon />}
      label={<TransText>Network Routing</TransText>}
      collapsible
      visible={permission.networks.read || permission.routes.read}
    >
      <SidebarItem
        label={<TransText>Networks</TransText>}
        isChild
        href={"/networks"}
        exactPathMatch={true}
        visible={permission.networks.read}
      />
      <SidebarItem
        label={<TransText>Routes</TransText>}
        isChild
        href={"/network-routes"}
        exactPathMatch={true}
        visible={permission.routes.read}
      />
    </SidebarItem>
  );
};
