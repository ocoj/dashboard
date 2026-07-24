"use client";

import Breadcrumbs from "@components/Breadcrumbs";
import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import useFetchApi from "@utils/api";
import { ExternalLinkIcon, ShieldCheck } from "lucide-react";
import React, { lazy, Suspense } from "react";
import AccessControlIcon from "@/assets/icons/AccessControlIcon";
import GroupsProvider from "@/contexts/GroupsProvider";
import { usePermissions } from "@/contexts/PermissionsProvider";
import PoliciesProvider from "@/contexts/PoliciesProvider";
import { PostureCheck } from "@/interfaces/PostureCheck";
import PageContainer from "@/layouts/PageContainer";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

const PostureCheckTable = lazy(
  () => import("@/modules/posture-checks/table/PostureCheckTable"),
);
export default function PostureChecksPage() {
  const { permission } = usePermissions();
  const { data: postureChecks, isLoading } =
    useFetchApi<PostureCheck[]>("/posture-checks");

  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <GroupsProvider>
        <div className={"p-default py-6"}>
          <Breadcrumbs>
            <Breadcrumbs.Item
              href={"/access-control"}
              label={zhMap["Access Control"]}
              icon={<AccessControlIcon size={14} />}
            />
            <Breadcrumbs.Item
              href={"/posture-checks"}
              label={zhMap["Posture Checks"]}
              active
              icon={<ShieldCheck size={15} />}
            />
          </Breadcrumbs>
          <h1 ref={headingRef}><TransText>Posture Checks</TransText></h1>
          <Paragraph>
            <TransText>Use posture checks to further restrict access in your network.</TransText>{" "}
            <InlineLink
              href={"https://docs.netbird.io/how-to/manage-posture-checks"}
              target={"_blank"}
            >
              <TransText>Learn more</TransText>
              <ExternalLinkIcon size={12} />
            </InlineLink>
          </Paragraph>
        </div>

        <RestrictedAccess
          page={"Posture Checks"}
          hasAccess={permission.policies.read}
        >
          <PoliciesProvider>
            <Suspense fallback={<SkeletonTable />}>
              <PostureCheckTable
                headingTarget={portalTarget}
                isLoading={isLoading}
                postureChecks={postureChecks}
              />
            </Suspense>
          </PoliciesProvider>
        </RestrictedAccess>
      </GroupsProvider>
    </PageContainer>
  );
}
