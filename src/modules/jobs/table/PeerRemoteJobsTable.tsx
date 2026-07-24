import Card from "@components/Card";
import { DataTable } from "@components/table/DataTable";
import DataTableHeader from "@components/table/DataTableHeader";
import NoResults from "@components/ui/NoResults";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { ClipboardList } from "lucide-react";
import React, { useState } from "react";
import { useSWRConfig } from "swr";
import DataTableRefreshButton from "@/components/table/DataTableRefreshButton";
import { DataTableRowsPerPage } from "@/components/table/DataTableRowsPerPage";
import { Job } from "@/interfaces/Job";
import EmptyRow from "@/modules/common-table-rows/EmptyRow";
import LastTimeRow from "@/modules/common-table-rows/LastTimeRow";
import { JobOutputCell } from "@/modules/jobs/table/JobOutputCell";
import { JobParametersCell } from "@/modules/jobs/table/JobParametersCell";
import JobStatusCell from "@/modules/jobs/table/JobStatusCell";
import { JobTypeCell } from "@/modules/jobs/table/JobTypeCell";
import { RemoteJobDropdownButton } from "@/modules/peer/RemoteJobDropdownButton";
import { TransText } from "@/i18n/trans-text";
import zhMap from "@/i18n/zh-map";

type Props = {
  jobs?: Job[];
  peerID: string;
  isLoading: boolean;
  headingTarget?: HTMLHeadingElement | null;
};

const PeerRemoteJobsColumns: ColumnDef<Job>[] = [
  {
    accessorKey: "Type",
    header: ({ column }) => (
      <DataTableHeader column={column}><TransText>Type</TransText></DataTableHeader>
    ),
    cell: ({ row }) => <JobTypeCell job={row.original} />,
  },
  {
    accessorKey: "CreatedAt",
    header: ({ column }) => (
      <DataTableHeader column={column}><TransText>Created</TransText></DataTableHeader>
    ),
    sortingFn: "datetime",
    cell: ({ row }) => (
      <LastTimeRow date={row.original.created_at} text={zhMap["Created at"] || "Created at"} />
    ),
  },
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableHeader column={column}><TransText>Status</TransText></DataTableHeader>
    ),
    cell: ({ row }) => <JobStatusCell job={row.original} />,
  },
  {
    accessorKey: "CompletedAt",
    header: ({ column }) => (
      <DataTableHeader column={column}><TransText>Completed</TransText></DataTableHeader>
    ),
    sortingFn: "datetime",
    cell: ({ row }) =>
      row.original.completed_at ? (
        <LastTimeRow date={row.original.completed_at} text={zhMap["Completed at"] || "Completed at"} />
      ) : (
        <EmptyRow />
      ),
  },
  {
    accessorKey: "Parameters",
    header: ({ column }) => (
      <DataTableHeader column={column}><TransText>Parameters</TransText></DataTableHeader>
    ),
    cell: ({ row }) => (
      <JobParametersCell parameters={row.original.workload.parameters} />
    ),
  },
  {
    id: "ResultOrReason",
    header: ({ column }) => (
      <DataTableHeader column={column}><TransText>Output</TransText></DataTableHeader>
    ),
    cell: ({ row }) => <JobOutputCell job={row.original} />,
  },
];

export default function PeerRemoteJobsTable({
  jobs,
  isLoading,
  headingTarget,
  peerID,
}: Props) {
  const { mutate } = useSWRConfig();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "CreatedAt", desc: true },
  ]);

  return (
    <DataTable
      rightSide={() => (
        <div className={"gap-x-4 ml-auto flex"}>
          <RemoteJobDropdownButton />
        </div>
      )}
      wrapperComponent={Card}
      wrapperProps={{ className: "mt-6 w-full" }}
      headingTarget={headingTarget}
      useRowId={true}
      sorting={sorting}
      setSorting={setSorting}
      minimal={true}
      showSearchAndFilters={true}
      inset={false}
      tableClassName="mt-0"
      text={zhMap["Jobs"] || "Jobs"}
      columns={PeerRemoteJobsColumns}
      keepStateInLocalStorage={false}
      data={jobs}
      searchPlaceholder={zhMap["Search by type, status, or parameters..."] || "Search by type, status, or parameters..."}
      isLoading={isLoading}
      getStartedCard={
        <NoResults
          className="py-4"
          title={zhMap["This peer has no remote jobs"] || "This peer has no remote jobs"}
          description={zhMap["Create a debug bundle or trigger other remote jobs to see them listed here."] || "Create a debug bundle or trigger other remote jobs to see them listed here."}
          icon={<ClipboardList size={20} className="text-nb-gray-300" />}
        />
      }
      paginationPaddingClassName="px-0 pt-8"
    >
      {(table) => (
        <>
          <DataTableRowsPerPage table={table} disabled={jobs?.length == 0} />
          <DataTableRefreshButton
            isDisabled={jobs?.length == 0}
            onClick={() => {
              mutate(`/peers/${peerID}/jobs`).then();
            }}
          />
        </>
      )}
    </DataTable>
  );
}
