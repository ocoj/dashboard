import * as React from "react";
import integrationImage from "@/assets/integrations/entra-id.png";
import { IdentityProvider } from "@/interfaces/IdentityProvider";
import { GenericSCIM } from "@/modules/integrations/idp-sync/generic-scim/GenericSCIM";
import zhMap from "@/i18n/zh-map";

export const EntraSCIM = () => {
  return (
    <GenericSCIM
      provider={IdentityProvider.ENTRA}
      name={"Entra ID (SCIM)"}
      description={zhMap["Synchronize users and groups from Microsoft Entra ID via the SCIM protocol."] || "Synchronize users and groups from Microsoft Entra ID via the SCIM protocol."}
      url={{
        title: "microsoft.com",
        href: "https://learn.microsoft.com/en-us/entra/architecture/sync-scim",
      }}
      image={integrationImage}
    />
  );
};
