import FeatureCard, { FeatureCardStatus } from "@components/FeatureCard";
import useFetchApi from "@utils/api";
import loadConfig from "@utils/config";
import { isNetBirdCloud } from "@utils/netbird";
import { ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMemo } from "react";
import { AccountMFA } from "@/cloud/mfa/AccountMFASettings";
import zhMap from "@/i18n/zh-map";

const config = loadConfig();

export const AccountMfaCard = () => {
  const { data: accountMfa } = useFetchApi<AccountMFA>(
    "/service/mfa",
    true,
    true,
    !!config.authServiceUrl,
    {
      origin: config.authServiceUrl,
    },
  );

  const enabled = useMemo(() => {
    return accountMfa?.mfa || false;
  }, [accountMfa]);

  const router = useRouter();

  return (
    isNetBirdCloud() && (
      <FeatureCard
        onClick={() => router.push("/settings?tab=authentication")}
        aria-label={zhMap["Multi-Factor Authentication (MFA)"] || "Multi-Factor Authentication (MFA)"}
        className={"min-w-[432px]"}
        icon={<ShieldCheckIcon size={16} />}
        title={zhMap["Multi-Factor Authentication (MFA)"] || "Multi-Factor Authentication (MFA)"}
        action={<FeatureCardStatus enabled={enabled} />}
        description={zhMap["Enable NetBird MFA if not configured in your IdP"] || "Enable NetBird MFA if not configured in your IdP"}
      />
    )
  );
};
