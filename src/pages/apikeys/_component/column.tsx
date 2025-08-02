/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const apiKeysColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM dd, yyyy"),
  },
  {
    accessorKey: "displayKey",
    header: "Display Key",
    cell: ({ row }) => {
      const displayKey = row.original?.displayKey;
      return (
        <div className="px-2 py-1 border border-gray-200 bg-gray-100 dark:bg-gray-700 dark:border-gray-800">
          {displayKey}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM dd, yyyy"),
  },
  {
    accessorKey: "lastUsed",
    header: "Last Used",
    cell: ({ row }) => format(row.getValue("lastUsedAt"), "MMM dd, yyyy"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// eslint-disable-next-line react-refresh/only-export-components
const ActionsCell = ({ row }: { row: any }) => {
  const apiKeyId = row.original.id;
  console.log(apiKeyId);
  const isDeleting = false;
  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-44"
        align="end"
        onCloseAutoFocus={(e: { preventDefault: () => void }) => {
          e.preventDefault();
        }}
      >
        <DropdownMenuItem
          className="relative !text-destructive"
          disabled={isDeleting}
          onSelect={(e: Event) => {
            e.preventDefault();
            return;
            //handleDelete(e);
          }}
        >
          <Trash2 className="mr-1 h-4 w-4 !text-destructive" />
          Delete
          {isDeleting && (
            <Loader className="ml-1 h-4 w-4 absolute right-2 animate-spin" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const tempdata = [
  {
    name: "",
  },
];
