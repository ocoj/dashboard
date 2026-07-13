import Breadcrumbs from "@components/Breadcrumbs";
import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import { SkeletonIntegration } from "@components/skeletons/SkeletonIntegration";
import * as Tabs from "@radix-ui/react-tabs";
import { isNetBirdCloud } from "@utils/netbird";
import { ExternalLinkIcon, FingerprintIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import IntegrationIcon from "@/assets/icons/IntegrationIcon";
import { useAccount } from "@/modules/account/useAccount";
import { LockedFeatureInfoCard } from "@/modules/billing/locked-feature/LockedFeatureInfoCard";
import { LockedFeatureOverlay } from "@/modules/billing/locked-feature/LockedFeatureOverlay";
import { AzureAD } from "@/modules/integrations/idp-sync/azure-ad/AzureAD";
import { EntraSCIM } from "@/modules/integrations/idp-sync/entra-scim/EntraSCIM";
import { GenericSCIM } from "@/modules/integrations/idp-sync/generic-scim/GenericSCIM";
import { GoogleWorkspace } from "@/modules/integrations/idp-sync/google-workspace/GoogleWorkspace";
import { Jumpcloud } from "@/modules/integrations/idp-sync/jumpcloud/Jumpcloud";
import { Okta } from "@/modules/integrations/idp-sync/okta-scim/Okta";
import { useIntegrations } from "@/modules/integrations/idp-sync/useIntegrations";
import { Callout } from "@components/Callout";

export default function IdentityProviderTab() {
  const t = useTranslations("integrations");
  const account = useAccount();

  useIntegrations();

  return (
    <Tabs.Content value={"identity-provider"}>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/integrations"}
            label={t("title")}
            icon={<IntegrationIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings?tab=identity-provider"}
            label={t("identityProviderSync")}
            icon={<FingerprintIcon size={14} />}
            active
          />
        </Breadcrumbs>
        <h1>{t("identityProviderSync")}</h1>
        <Paragraph>
          {t("identityProviderSyncDesc")}
        </Paragraph>
        <Paragraph>
          <InlineLink
            href={"https://docs.netbird.io/how-to/idp-sync"}
            target={"_blank"}
          >
            {t("learnMore")}
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </Paragraph>

        <LockedFeatureInfoCard
          featureText={"Identity Provider (IdP) Sync"}
          feature={"IDP_SYNC"}
        />

        <LockedFeatureOverlay feature={"IDP_SYNC"} opacity={100}>
          <div
            className={
              "gap-6 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
            }
          >
            {!account ? (
              <>
                <SkeletonIntegration loadingHeight={196} />
                <SkeletonIntegration loadingHeight={196} />
                <SkeletonIntegration loadingHeight={196} />
                <SkeletonIntegration loadingHeight={196} />
              </>
            ) : (
              <>
                <GoogleWorkspace />
                <AzureAD />
                <EntraSCIM />
                <Okta />
                <Jumpcloud />
                <GenericSCIM />
              </>
            )}
          </div>
            { isNetBirdCloud() && <Callout variant={"warning"} className={"max-w-lg mt-6"}>
            Looking to enable a custom IdP like Keycloak? <br />
            Please contact us at{" "}
            <InlineLink
              href={"mailto:support@netbird.io"}
              className={"inline !text-netbird-500 font-medium"}
            >
              {" "}
              support@netbird.io
            </InlineLink>{" "}
          </Callout>}
        </LockedFeatureOverlay>
      </div>
    </Tabs.Content>
  );
}
