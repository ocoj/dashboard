import InlineLink from "@components/InlineLink";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

export const MSPTenantDocsLink = () => {
  return (
    <>
      <TransText>Learn more about</TransText>
      <InlineLink
        href={"https://docs.netbird.io/how-to/msp-portal"}
        target={"_blank"}
      >
        <TransText>MSP Portal</TransText>
        <ExternalLinkIcon size={12} />
      </InlineLink>
    </>
  );
};
