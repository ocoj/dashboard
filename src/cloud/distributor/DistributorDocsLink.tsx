import InlineLink from "@components/InlineLink";
import { ExternalLinkIcon } from "lucide-react";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

export const DistributorDocsLink = () => {
  return (
    <>
      <TransText>Learn more about</TransText>
      <InlineLink
        href={"https://docs.netbird.io/manage/for-partners/distributor-portal"}
        target={"_blank"}
      >
        <TransText>Customers</TransText>
        <ExternalLinkIcon size={12} />
      </InlineLink>
    </>
  );
};
