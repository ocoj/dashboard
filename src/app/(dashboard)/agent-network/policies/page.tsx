"use client";

import InlineLink from "@components/InlineLink";
import Paragraph from "@components/Paragraph";
import SkeletonTable from "@components/skeletons/SkeletonTable";
import { RestrictedAccess } from "@components/ui/RestrictedAccess";
import { usePortalElement } from "@hooks/usePortalElement";
import { ExternalLinkIcon } from "lucide-react";
import React, { Suspense } from "react";
import { usePermissions } from "@/contexts/PermissionsProvider";
import { TransText } from '@/i18n/trans-text';
import zhMap from "@/i18n/zh-map";
import PageContainer from "@/layouts/PageContainer";
import AgentPoliciesTable from "@/modules/agent-network/AgentPoliciesTable";
import AIProvidersProvider from "@/modules/agent-network/AIProvidersProvider";

export default function AgentNetworkPoliciesPage() {
  const { permission } = usePermissions();
  const { ref: headingRef, portalTarget } =
    usePortalElement<HTMLHeadingElement>();

  return (
    <PageContainer>
      <div className={"p-default py-6"}>
        {/* "Agent Policies", next to Networking's Access Control › Policies. */}
        <h1 ref={headingRef}><TransText>Agent Policies</TransText></h1>
        <Paragraph>
          <TransText>Bind IdP groups to providers: Engineering gets Claude, Finance doesn't. Enforce token limits, budgets, and guardrails.</TransText>
        </Paragraph>
      </div>

      <RestrictedAccess
        page={"Agent Policies"}
        hasAccess={permission?.["agent_network.policies"]?.read}
      >
        <AIProvidersProvider>
          <Suspense fallback={<SkeletonTable />}>
            <AgentPoliciesTable headingTarget={portalTarget} />
          </Suspense>
        </AIProvidersProvider>
      </RestrictedAccess>
    </PageContainer>
  );
}
