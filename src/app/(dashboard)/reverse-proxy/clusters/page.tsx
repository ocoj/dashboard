"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import { ExternalLinkIcon } from "lucide-react";
import React, { lazy, Suspense } from "react";
import ReverseProxyIcon from "@/assets/icons/ReverseProxyIcon";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { REVERSE_PROXY_CLUSTERS_DOCS_LINK } from "@/interfaces/ReverseProxy";
import PageContainer from "@/layouts/PageContainer";
import { TransText } from "@/i18n/trans-text";

const ClustersTable = lazy(
  () => import("@/modules/reverse-proxy/clusters/ClustersTable"),
);

export default function ReverseProxyClustersPage() {
  const { permission } = usePermissions();

  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/reverse-proxy/services"}
            label={"Reverse Proxy"}
            icon={<ReverseProxyIcon size={16} />}
          />
          <Breadcrumbs.Item
            href={"/reverse-proxy/clusters"}
            label={"Clusters"}
            active={true}
          />
        </Breadcrumbs>
        <h1 ref={headingRef}><TransText>Clusters</TransText></h1>
        <Paragraph>
          <TransText>Proxy clusters route inbound traffic to your services. Shared clusters are run by the platform; account clusters (self-hosted) run on your own infrastructure.</TransText>{" "}
          <InlineLink href={REVERSE_PROXY_CLUSTERS_DOCS_LINK} target={"_blank"}>
            <TransText>Learn more</TransText>
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </Paragraph>
      </div>
      <RestrictedAccess
        page={"Clusters"}
        hasAccess={permission?.services?.read}
      >
        <Suspense fallback={<SkeletonTable />}>
          <ClustersTable headingTarget={portalTarget} />
        </Suspense>
      </RestrictedAccess>
    </PageContainer>
  );
}
