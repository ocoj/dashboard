import Button from "@components/Button";
import { cn } from "@utils/helpers";
import { isNetBirdCloud } from "@utils/netbird";
import { LockIcon, MailIcon } from "lucide-react";
import * as React from "react";
import { useTranslations } from "next-intl";
import { PlanFeatureAvailability } from "@/cloud/cloud-hooks/useIsFeatureLocked";
import { useTrial } from "@/cloud/cloud-hooks/useTrial";
import { useMSP } from "@/cloud/msp/contexts/MSPProvider";
import { useLoggedInUser } from "@/contexts/UsersProvider";
import { PlanTier } from "@/interfaces/Subscription";
import { LockedFeatureInfoCardProps } from "@/modules/billing/locked-feature/LockedFeatureInfoCard";
import { TrialOrUpgradeButton } from "@/modules/billing/trial/TrialOrUpgradeButton";

export const LockedFeatureContent = ({
  feature,
  isTooltip = false,
  featureText = "This",
  isCard = false,
  offerTrial = true,
}: LockedFeatureInfoCardProps) => {
  const t = useTranslations("billing");
  const { isMSPInTenantContext, isAccountWithMSPParent } = useMSP();
  const { isOwnerOrAdmin } = useLoggedInUser();
  const plan = PlanFeatureAvailability[feature];

  const planText = isNetBirdCloud()
    ? plan == "team"
      ? t("plan_team")
      : t("plan_business")
    : t("plan_enterprise");

  return (
    <>
      <div className={"z-10 relative"}>
        <div
          className={cn(
            "flex items-center font-normal mb-1",
            isTooltip ? "text-sm gap-1.5" : "text-base gap-2",
          )}
        >
          <LockIcon
            size={isTooltip ? 12 : 14}
            className={cn("relative", isTooltip && "-top-[1px]")}
          />
          {planText}
        </div>
        <div
          className={cn(
            "text-nb-gray-300 font-light",
            isTooltip ? "text-xs" : "",
          )}
        >
          <AvailableOnPlanText featureText={featureText} plan={plan} />
          {isCard && <br />}
          <UpgradeOrTrialText offerTrial={offerTrial} />
        </div>
      </div>
      {(isOwnerOrAdmin || !isNetBirdCloud()) && (
        <TrialOrUpgradeButton
          plan={plan}
          feature={feature}
          variant={"primary"}
          isCard={isCard}
          isTooltip={isTooltip}
          offerTrial={offerTrial}
          hidden={isAccountWithMSPParent}
        />
      )}
      {isAccountWithMSPParent && !isMSPInTenantContext && (
        <GetMSPSupportButton />
      )}
    </>
  );
};

const AvailableOnPlanText = ({
  featureText,
  plan,
}: {
  featureText: string;
  plan: PlanTier;
}) => {
  const t = useTranslations("billing");
  const isOrAre = featureText.includes("Posture Checks") ? "are" : "is";
  const teamOrBusiness =
    plan == "team" ? t("plan_team_or_higher") : t("plan_business_name");

  if (!isNetBirdCloud()) {
    return (
      <>
        {t("available_enterprise_license", {
          featureText,
          isOrAre,
          plan: teamOrBusiness,
        })}
      </>
    );
  }

  return (
    <>
      {t("available_on_plan", { featureText, isOrAre, plan: teamOrBusiness })}
    </>
  );
};

const UpgradeOrTrialText = ({
  offerTrial = true,
}: {
  offerTrial?: boolean;
}) => {
  const t = useTranslations("billing");
  const {
    isMSPInTenantContext,
    isAccountWithMSPParent,
    mspContact,
    hasReseller,
  } = useMSP();
  const { isTrialAvailable } = useTrial();
  const { isOwnerOrAdmin } = useLoggedInUser();

  if (!isNetBirdCloud()) {
    return <></>;
  }

  if (hasReseller) {
    return <>{t("contact_admin_upgrade")}</>;
  }

  if (isAccountWithMSPParent && !isMSPInTenantContext) {
    return (
      <>
        {t("contact_admin_msp", { contact: mspContact || "" })}
      </>
    );
  }

  if (!isOwnerOrAdmin)
    return <>{t("only_owner_admin_upgrade")}</>;

  if (isTrialAvailable && offerTrial)
    return <>{t("upgrade_or_trial")}</>;

  return (
    <>
      {t("upgrade_plan_access", {
        planType: isMSPInTenantContext ? "tenants" : "current",
      })}
    </>
  );
};

const GetMSPSupportButton = () => {
  const t = useTranslations("billing");
  const { mspInfo, hasReseller } = useMSP();
  const mailToEmail = mspInfo?.parent_owner_email || "support@netbird.io";
  if (hasReseller) return;

  return (
    <div className={"relative top-1 min-w-[160px]"}>
      <a
        href={`mailto:${mailToEmail}?subject=Request%20for%20Assistance%3A%20Upgrade%20Plan`}
        className={"w-full"}
      >
        <Button
          size={"xs"}
          variant={"primary"}
          className={cn("w-full h-[34px]")}
        >
          <MailIcon size={15} className={"shrink-0"} />
          {t("get_support")}
        </Button>
      </a>
    </div>
  );
};
