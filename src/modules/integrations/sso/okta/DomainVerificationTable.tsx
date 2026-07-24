import Card from "@components/Card";
import { DataTable } from "@components/table/DataTable";
import DataTableHeader from "@components/table/DataTableHeader";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import * as React from "react";
import { useState } from "react";
import { EnterpriseConnectionDomain } from "@/interfaces/IdentityProvider";
import LastTimeRow from "@/modules/common-table-rows/LastTimeRow";
import zhMap from "@/i18n/zh-map";
import { TransText } from "@/i18n/trans-text";

export const DomainTableColumns: ColumnDef<EnterpriseConnectionDomain>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableHeader column={column}><TransText>Domain</TransText></DataTableHeader>;
    },
    sortingFn: "text",
  },
  {
    accessorKey: "validation_status",
    header: ({ column }) => {
      return <DataTableHeader column={column}><TransText>Status</TransText></DataTableHeader>;
    },
    sortingFn: "text",
  },
  {
    accessorKey: "validation_last_updated",
    header: ({ column }) => {
      return <DataTableHeader column={column}><TransText>Last Check</TransText></DataTableHeader>;
    },
    sortingFn: "text",
    cell: ({ row }) => (
      <LastTimeRow
        date={dayjs(row.original.validation_last_updated).toDate()}
        text={zhMap["Last checked on"]}
      />
    ),
  },
];

type Props = {
  domains: EnterpriseConnectionDomain[];
};
export const DomainVerificationTable = ({ domains }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "is_current",
      desc: true,
    },
    {
      id: "name",
      desc: true,
    },
  ]);

  return (
    <Card className={"w-full"}>
      <DataTable
        showHeader={false}
        tableClassName={"w-full mt-0"}
        minimal={true}
        showSearchAndFilters={false}
        text={zhMap["Domains"]}
        sorting={sorting}
        setSorting={setSorting}
        columns={DomainTableColumns}
        data={domains}
      />
    </Card>
  );
};
