import Badge from "@components/Badge";
import Button from "@components/Button";
import FullTooltip from "@components/FullTooltip";
import { cn } from "@utils/helpers";
import { HelpCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMemo } from "react";
import PeerIcon from "@/assets/icons/PeerIcon";
import { GroupedRoute } from "@/interfaces/Route";
import { useAddRoutingPeer } from "@/modules/routes/RouteAddRoutingPeerProvider";
import { TransText } from "@/i18n/trans-text";

type Props = {
  groupedRoute: GroupedRoute;
};
export default function GroupedRouteHighAvailabilityCell({
  groupedRoute,
}: Props) {
  const router = useRouter();
  const isActive = useMemo(() => {
    return groupedRoute.high_availability_count > 1;
  }, [groupedRoute.high_availability_count]);

  const disabledText = useMemo(
    () => (
      <>
        High availability is currently{" "}
        <span className={"text-red-500 font-medium"}>disabled</span> for this
        route.
      </>
    ),
    [],
  );

  const enabledText = useMemo(
    () => (
      <>
        High availability is{" "}
        <span className={"text-green-500 font-medium"}>enabled</span> for this
        route.
      </>
    ),
    [],
  );

  const { openAddRoutingPeerModal } = useAddRoutingPeer();

  return (
    <FullTooltip
      interactive={false}
      content={
        <div className={"max-w-xs text-xs"}>
          {!isActive && !groupedRoute.is_using_route_groups && (
            <>
              {disabledText}
              <div className={"inline-flex mt-2"}>
                <TransText>Go ahead and add more routing peers to enable high availability for this network route.</TransText>
              </div>
            </>
          )}
          {isActive && !groupedRoute.is_using_route_groups && (
            <>
              {enabledText}
              <div className={"inline-flex mt-2"}>
                <TransText>You can add more peers to increase the availability of this network route.</TransText>
              </div>
            </>
          )}
          {!isActive && groupedRoute.is_using_route_groups && (
            <>
              {disabledText}
              <div className={"inline-flex mt-2"}>
                <TransText>To configure, you must add more peers to a group in this route. You can do it in the Peers menu.</TransText>
              </div>
            </>
          )}
          {isActive && groupedRoute.is_using_route_groups && (
            <>
              {enabledText}
              <div className={"inline-flex mt-2"}>
                <TransText>You can add more peers to a group in this route by going to the peers page.</TransText>
              </div>
            </>
          )}
        </div>
      }
    >
      <div className={"flex gap-3 items-center"}>
        <Badge
          variant={isActive ? "green" : "gray"}
          className={cn(
            "inline-flex gap-2  min-w-[110px] font-medium items-center justify-center min-h-[34px]",
            !isActive && "opacity-30",
          )}
          useHover={true}
        >
          {isActive ? (
            <>
              <div className={"h-2 w-2 rounded-full bg-green-500"}></div>
              {groupedRoute.high_availability_count} Peer(s)
            </>
          ) : (
            <>
              <div className={"h-2 w-2 rounded-full bg-nb-gray-700"}></div>
              <TransText>Disabled</TransText>
            </>
          )}
          <HelpCircle size={12} />
        </Badge>
        {groupedRoute.is_using_route_groups && (
          <Button
            size={"xs"}
            variant={"secondary"}
            className={"min-w-[130px]"}
            onClick={() => router.push("/peers")}
          >
            <>
              <PeerIcon size={12} />
              <TransText>Go to Peers</TransText>
            </>
          </Button>
        )}
        {!groupedRoute.is_using_route_groups && (
          <Button
            size={"xs"}
            variant={"secondary"}
            className={"min-w-[130px]"}
            onClick={() => openAddRoutingPeerModal(groupedRoute)}
          >
            <PlusCircle size={12} />
            <TransText>Add Peer</TransText>
          </Button>
        )}{" "}
      </div>
    </FullTooltip>
  );
}
