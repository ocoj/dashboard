"use client";

import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import { ExternalLinkIcon, FolderGit2Icon } from "lucide-react";
import React, { lazy, Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import InlineLink from "@/components/InlineLink";
import { usePermissions } from "@/contexts/PermissionsProvider";
import PageContainer from "@/layouts/PageContainer";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

const GroupsTable = lazy(() => import("@/modules/groups/table/GroupsTable"));

export default function GroupsPage() {
  const { permission } = usePermissions();
  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <div className={"p-default py-6"}>
        <Breadcrumbs>
          <Breadcrumbs.Item
            href={"/groups"}
            label={zhMap["Groups"]}
            icon={<FolderGit2Icon size={14} />}
            active
          />
        </Breadcrumbs>
        <h1 ref={headingRef}><TransText>Groups</TransText></h1>
        <Paragraph>
          <TransText>Organize peers, users and resources into groups to manage access.</TransText>{" "}
          <InlineLink
            href={"https://docs.netbird.io/how-to/manage-network-access"}
            target={"_blank"}
          >
            <TransText>Learn more</TransText>
            <ExternalLinkIcon size={12} />
          </InlineLink>
        </Paragraph>
      </div>
      <RestrictedAccess hasAccess={permission.groups.read} page={"Groups"}>
        <Suspense fallback={<SkeletonTable />}>
          <GroupsTable headingTarget={portalTarget} />
        </Suspense>
      </RestrictedAccess>
    </PageContainer>
  );
}
