import Button from "@components/Button";
import { cn } from "@utils/helpers";
import { isNetBirdCloud } from "@utils/netbird";
import { LockIcon, MailIcon } from "lucide-react";
import * as React from "react";
import { PlanFeatureAvailability } from "@/cloud/cloud-hooks/useIsFeatureLocked";
import { useTrial } from "@/cloud/cloud-hooks/useTrial";
import { useMSP } from "@/cloud/msp/contexts/MSPProvider";
import { useLoggedInUser } from "@/contexts/UsersProvider";
import { PlanTier } from "@/interfaces/Subscription";
import { LockedFeatureInfoCardProps } from "@/modules/billing/locked-feature/LockedFeatureInfoCard";
import { TrialOrUpgradeButton } from "@/modules/billing/trial/TrialOrUpgradeButton";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

export enum PLAN_TEXT {
  TEAM = "Available on Team",
  BUSINESS = "Available on Business",
  ENTERPRISE = "Available with an Enterprise license",
}

export const LockedFeatureContent = ({
  feature,
  isTooltip = false,
  featureText = "This",
  isCard = false,
  offerTrial = true,
}: LockedFeatureInfoCardProps) => {
  const { isMSPInTenantContext, isAccountWithMSPParent } = useMSP();
  const { isOwnerOrAdmin } = useLoggedInUser();
  const plan = PlanFeatureAvailability[feature];

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
            <TransText>{ isNetBirdCloud()? (plan == "team" ? PLAN_TEXT.TEAM : PLAN_TEXT.BUSINESS) : PLAN_TEXT.ENTERPRISE }</TransText>
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
  const teamOrBusiness =
    plan == "team" ? zhMap["Team plan or higher."] || "Team plan or higher. " : zhMap["Business plan."] || "Business plan. ";
  if (!isNetBirdCloud()) {
      const enterpriseText = zhMap["is available with a NetBird Enterprise commercial license, or on NetBird Cloud with the"] || "is available with a NetBird Enterprise commercial license, or on NetBird Cloud with the";
      return (
      <>
        {featureText} {enterpriseText} {teamOrBusiness}
      </>
      )
  }

  const cloudText = zhMap["is available on the"] || "is available on the";
  return (
    <>
      {featureText} {cloudText} {teamOrBusiness}
    </>
  );
};

const UpgradeOrTrialText = ({
  offerTrial = true,
}: {
  offerTrial?: boolean;
}) => {
  const {
    isMSPInTenantContext,
    isAccountWithMSPParent,
    mspContact,
    hasReseller,
  } = useMSP();
  const { isTrialAvailable } = useTrial();
  const { isOwnerOrAdmin } = useLoggedInUser();

  if (!isNetBirdCloud()) {
    return (
      <>
      </>
    );
  }

  if (hasReseller) {
    return <>{zhMap["Contact your account administrator to upgrade the plan."] || "Contact your account administrator to upgrade the plan."}</>;
  }

  if (isAccountWithMSPParent && !isMSPInTenantContext) {
    return (
      <>
        {zhMap["Contact your account administrator"] || "Contact your account administrator"}{" "}
        <span className={"text-nb-gray-200 font-medium"}>{mspContact}</span>{" "}
        {zhMap["to upgrade the plan."] || "to upgrade the plan."}
      </>
    );
  }

  if (!isOwnerOrAdmin)
    return zhMap["Only the owner or an admin can upgrade the plan."] || "Only the owner or an admin can upgrade the plan.";

  if (isTrialAvailable && offerTrial)
    return zhMap["Upgrade or start a 14-day free trial to access this feature."] || "Upgrade or start a 14-day free trial to access this feature.";

  return `${zhMap["Upgrade your"] || "Upgrade your"} ${
    isMSPInTenantContext ? (zhMap["tenants"] || "tenants") : (zhMap["current"] || "current")
  } ${zhMap["plan to access this feature."] || "plan to access this feature."}`;
};

const GetMSPSupportButton = () => {
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
          <TransText>Get Support</TransText>
        </Button>
      </a>
    </div>
  );
};
