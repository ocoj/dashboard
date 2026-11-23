import HelpText from "@components/HelpText";
import * as React from "react";
import { TransText } from "@/i18n/trans-text";

type Props = {
  type?: "user-groups" | "groups";
};
export const GroupPrefixHelpText = ({ type = "groups" }: Props) => {
  return type === "user-groups" ? (
    <HelpText className={"max-w-lg mt-2"}>
      <TransText>By default,</TransText>{" "}
      <span className={"text-netbird font-semibold"}><TransText>All Users</TransText></span>{" "}
      <TransText>will be synchronized from your IdP to NetBird.</TransText> <br />
      <TransText>If you want to synchronize only users that belong to a specific group, you can add them below. Keep in mind that the prefix matching is case-sensitive.</TransText>
    </HelpText>
  ) : (
    <HelpText className={"max-w-lg mt-2"}>
      <TransText>By default,</TransText>{" "}
      <span className={"text-netbird font-semibold"}><TransText>All Groups</TransText></span>{" "}
      <TransText>will be synchronized from your IdP to NetBird.</TransText> <br />
      <TransText>If you want to synchronize only groups that start with a specific prefix, you can add them below. Keep in mind that the prefix matching is case-sensitive.</TransText>
    </HelpText>
  );
};
