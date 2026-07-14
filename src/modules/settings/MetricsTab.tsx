import Breadcrumbs from "@components/Breadcrumbs";
import FancyToggleSwitch from "@components/FancyToggleSwitch";
import InlineLink from "@components/InlineLink";
import { notify } from "@components/Notification";
import Paragraph from "@components/Paragraph";
import * as Tabs from "@radix-ui/react-tabs";
import { useApiCall } from "@utils/api";
import {
  ChartNoAxesCombined,
  ExternalLinkIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSWRConfig } from "swr";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { Account } from "@/interfaces/Account";

type Props = {
  account: Account;
};

export default function MetricsTab({ account }: Readonly<Props>) {
  const { permission } = usePermissions();
  const t = useTranslations("settings");
  const { mutate } = useSWRConfig();
  const saveRequest = useApiCall<Account>("/accounts/" + account.id, true);

  const [metricsPushEnabled, setMetricsPushEnabled] = useState(
    account.settings?.metrics_push_enabled ?? false,
  );

  const toggleMetricsPush = async (toggle: boolean) => {
    notify({
      title: t("metrics"),
      description: t("metricsToggleResult", { status: toggle ? t("enabled") : t("disabled") }),
      promise: saveRequest
        .put({
          id: account.id,
          settings: {
            ...account.settings,
            metrics_push_enabled: toggle,
          },
        })
        .then(() => {
          setMetricsPushEnabled(toggle);
          mutate("/accounts");
        }),
      loadingMessage: t("updatingMetrics"),
    });
  };

  return (
    <Tabs.Content value={"metrics"}>
      <div className={"p-default py-6 max-w-2xl"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/settings"}
            label={t("title")}
            icon={<SettingsIcon size={13} />}
          />
          <Breadcrumbs.Item
            href={"/settings?tab=metrics"}
            label={t("metrics")}
            icon={<ChartNoAxesCombined size={14} />}
            active
          />
        </Breadcrumbs>
        <div>
          <h1>{t("metrics")}</h1>
          <Paragraph>
            {t("metricsDescription")}
          </Paragraph>
          <Paragraph>
            {t("learnMoreAbout")}{" "}
            <InlineLink
              href={
                "https://docs.netbird.io/manage/client-metrics"
              }
              target={"_blank"}
            >
              {t("clientMetrics")}
              <ExternalLinkIcon size={12} />
            </InlineLink>
            {t("inOurDocumentation")}
          </Paragraph>
        </div>

        <FancyToggleSwitch
          className={"mt-6"}
          value={metricsPushEnabled}
          onChange={toggleMetricsPush}
          label={
            <>
              <ChartNoAxesCombined size={15} />
              {t("sharePerformanceMetrics")}
            </>
          }
          helpText={t("sharePerformanceMetricsHelp")}
          disabled={!permission.settings.update}
        />
      </div>
    </Tabs.Content>
  );
}
