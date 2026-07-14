import FullTooltip from "@components/FullTooltip";
import InlineLink from "@components/InlineLink";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";
import { useTranslations } from "next-intl";

type Props = {
  children: React.ReactNode;
  hoverButton?: boolean;
};
export const ExitNodeHelpTooltip = ({
  children,
  hoverButton = false,
}: Props) => {
  const t = useTranslations("routes");
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <FullTooltip
        hoverButton={hoverButton}
        content={
          <div className={"text-xs max-w-xs"}>
            {t("exitNodeTooltip")}
            <div className={"mt-2"}>
              {t("learnMore")}{" "}
              <InlineLink
                href={
                  "https://docs.netbird.io/how-to/configuring-default-routes-for-internet-traffic"
                }
                target={"_blank"}
                className={"mr-1"}
              >
                {t("exitNodes")}
                <ExternalLinkIcon size={10} />
              </InlineLink>
              {t("inOurDocumentation")}
            </div>
          </div>
        }
      >
        {children}
      </FullTooltip>
    </div>
  );
};
