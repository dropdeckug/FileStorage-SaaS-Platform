import { DataTable } from "@/components/data-table";
import { apiKeysColumns } from "./column";
import { useState } from "react";

const AllApiKeys = () => {
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  // const { data, isFetching } = useGetAllApikeysQuery({
  //   pageNumber: filter.pageNumber,
  //   pageSize: filter.pageSize,
  // });

  // const apiKeyData = data?.apiKeys ?? [];

  const isFetching = false;
  const pagination = {
    totalCount: 0,
    totalPages: 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handlePageChange = (pageNumber: number) => {
    setFilter((prev) => ({ ...prev, pageNumber }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize }));
  };

  return (
    <DataTable
      data={[]}
      columns={apiKeysColumns}
      isLoading={isFetching}
      selection={false}
      showSearch={false}
      emptyTitle={"No ApiKey created"}
      isShowPagination={true}
      pagination={pagination}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default AllApiKeys;
