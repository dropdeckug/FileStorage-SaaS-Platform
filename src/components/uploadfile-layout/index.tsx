import { useState } from "react";
import GridView from "./grid-view/grid-view";
import ListView from "./list-view/list-view";
import ToolBar from "./toolbar";
import useDebouncedSearch from "@/hooks/use-debounce-search";
import { LAYOUT_VIEW, LayoutViewType } from "@/constant";
import { toast } from "sonner";
import { FileType } from "@/features/files/filesType";

type Props = {
  layoutView: LayoutViewType;
  isShowPagination: boolean;
  showToolBar: boolean;
  pageSize?: number;
};

const dummy_data: FileType[] = [
  {
    _id: "1",
    id: "1",
    originalName: "Vacation_Photo.jpg",
    ext: "jpg",
    mimeType: "image/jpeg",
    size: 4300800, // 4.1 MB
    uploadedVia: "WEB",
    url: `https://randomuser.me/api/portraits/men/3.jpg`,
    createdAt: "2024-01-03",
    updatedAt: "",
    formattedSize: "4.1MB",
    userId: "",
  },
  {
    _id: "2",
    originalName: "Project_Brief.pdf",
    ext: "pdf",
    mimeType: "application/pdf",
    size: 2621440, // 2.5 MB
    uploadedVia: "WEB",
    url: "https://example.com/files/1",
    createdAt: "2024-01-01",
    updatedAt: "",
    formattedSize: "2.5MB",
    userId: "",
  },
  {
    _id: "3",
    originalName: "Meeting_Notes.docx",
    ext: "docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1887436, // 1.8 MB
    uploadedVia: "WEB",
    url: "https://example.com/files/2",
    createdAt: "2024-01-02",
    updatedAt: "",
    formattedSize: "1.8MB",
    userId: "",
  },

  {
    _id: "4",
    originalName: "Financial_Report.xlsx",
    ext: "xlsx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    size: 734003, // 0.7 MB
    uploadedVia: "WEB",
    url: "https://example.com/files/4",
    createdAt: "2024-01-04",
    updatedAt: "",
    formattedSize: "0.7MB",
    userId: "",
  },
  {
    _id: "5",
    originalName: "Website_Assets.zip",
    ext: "zip",
    mimeType: "application/zip",
    size: 12910592, // 12.3 MB
    uploadedVia: "WEB",
    url: "https://example.com/files/5",
    createdAt: "2024-01-05",
    updatedAt: "",
    formattedSize: "12.3MB",
    userId: "",
  },
  {
    _id: "6",
    originalName: "Design_Mockup.png",
    ext: "png",
    mimeType: "image/png",
    size: 3355443, // 3.2 MB
    uploadedVia: "WEB",
    url: `https://randomuser.me/api/portraits/women/8.jpg`,
    createdAt: "2024-01-06",
    updatedAt: "",
    formattedSize: "3.2MB",
    userId: "",
  },
  {
    _id: "7",
    originalName: "ReadMe.txt",
    ext: "txt",
    mimeType: "text/plain",
    size: 52428, // 0.05 MB
    uploadedVia: "WEB",
    url: "https://example.com/files/7",
    createdAt: "2024-01-07",
    updatedAt: "",
    formattedSize: "0.5MB",
    userId: "",
  },
  {
    _id: "8",
    originalName: "Presentation.pptx",
    ext: "pptx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: 6186598, // 5.9 MB
    uploadedVia: "WEB",
    url: "https://example.com/files/8",
    createdAt: "2024-01-08",
    updatedAt: "",
    formattedSize: "5.9MB",
    userId: "",
  },
];

const UploadFileLayout = (props: Props) => {
  const {
    layoutView = LAYOUT_VIEW.GRID,
    isShowPagination,
    showToolBar = true,
  } = props;

  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: props.pageSize || 10,
  });

  const [_layoutView, setLayoutView] = useState<LayoutViewType>(layoutView);
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([]);

  const { searchTerm, setSearchTerm } = useDebouncedSearch("", {
    delay: 500,
  });

  // const [downloadFiles, { isLoading: isDownloading }] =
  //   useDownloadFilesMutation();
  // const [deleteFiles, { isLoading: isDeleting }] = useDeleteFilesMutation();

  // const { data, isLoading, isFetching } = useGetAllFilesQuery({
  //   keyword: debouncedTerm,
  //   pageNumber: filter.pageNumber,
  //   pageSize: filter.pageSize,
  // });

  // const fileData = data?.files || [];

  const pagination = {
    totalCount: 0,
    totalPages: 0,
    pageNumber: filter.pageNumber,
    pageSize: filter.pageSize,
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleLayoutView = (view: LayoutViewType) => {
    setLayoutView(view);
  };

  const handleToggleSelected = (file: FileType) => {
    const isSelected = selectedFiles.find((f) => f._id === file._id);
    if (isSelected) {
      setSelectedFiles((prev) => prev.filter((f) => f._id !== file._id));
    } else {
      setSelectedFiles((prev) => [...prev, file]);
    }
  };

  const handleClear = () => {
    setSelectedFiles([]);
  };

  const handleCopy = () => {
    const urls = selectedFiles.map((file) => file.url).join("\n");
    navigator.clipboard
      .writeText(urls)
      .then(() => {
        setSelectedFiles([]);
        toast.success(`Copied ${selectedFiles.length} file url `);
      })
      .catch(() => {
        toast.error("Failed to copy links");
      });
  };

  const handleDelete = () => {
    //if (isDeleting) return;
    const fileIds = selectedFiles?.map((file) => file._id);
    if (!fileIds.length) {
      toast.error("No file selected");
      return;
    }

    // const toastId = toast.loading(
    //   `Deleting ${fileIds.length} selected file(s)...`
    // );
    // deleteFiles(fileIds)
    //   .unwrap()
    //   .then((res) => {
    //     toast.dismiss(toastId);
    //     if (res.failedCount > 0) {
    //       toast.warning(
    //         `Deleted ${res.deletedCount} file(s). ${res.failedCount} failed.`,
    //         { description: "Some files could not be deleted." }
    //       );
    //     } else {
    //       toast.success(`Successfully deleted ${res.deletedCount} file(s).`);
    //     }
    //     setSelectedFiles([]);
    //   })
    //   .catch(() => {
    //     toast.dismiss(toastId);
    //     toast.error("Failed to delete files. Please try again.");
    //   });
  };

  const handleDowload = () => {
    // if (isDownloading) return;
    const fileIds = selectedFiles?.map((file) => file._id);
    if (!fileIds.length) {
      toast.error("No file selected");
      return;
    }

    //  const toastId = toast.loading("Preparing your download...");
    //  downloadFiles(fileIds)
    //    .unwrap()
    //    .then((res) => {
    //      toast.dismiss(toastId);

    //      if (res?.downloadUrl) {
    //        // Same handling for both single files and ZIP files
    //        const link = document.createElement("a");
    //        link.href = res.downloadUrl;
    //        link.download = "";
    //        document.body.appendChild(link);
    //        link.click();
    //        link.remove();

    //        const message = res.isZip
    //          ? "ZIP file is downloading..."
    //          : "Your file is downloading...";

    //        toast.success(
    //          <>
    //            {message}
    //            <br />
    //            If it doesn't start,{" "}
    //            <a
    //              href={res.downloadUrl}
    //              target="_blank"
    //              rel="noopener noreferrer"
    //              className="underline !text-black"
    //            >
    //              click here
    //            </a>
    //            .
    //          </>
    //        );
    //      } else {
    //        toast.error("Download URL missing.");
    //      }
    //    })
    //    .catch(() => {
    //      toast.dismiss(toastId);
    //      toast.error("Download failed. Try again.");
    //    })
    //    .finally(() => {
    //      setSelectedFiles([]);
    //    });
  };

  return (
    <div>
      {showToolBar && (
        <ToolBar
          layoutView={_layoutView}
          searchTerm={searchTerm}
          isLoading={false}
          isSelected={selectedFiles?.length > 0 || false}
          noOfFileselected={selectedFiles?.length}
          handleSearch={handleSearch}
          handleLayoutView={handleLayoutView}
          onClear={handleClear}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onDownload={handleDowload}
        />
      )}
      <div className="mt-1">
        {_layoutView === LAYOUT_VIEW.LIST ? (
          <ListView
            data={dummy_data}
            isLoading={false}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            isShowPagination={isShowPagination}
            pagination={pagination}
            setPagination={setFilter}
          />
        ) : (
          <GridView
            data={dummy_data}
            isLoading={false}
            selectedFiles={selectedFiles}
            onToggleSelect={handleToggleSelected}
          />
        )}
      </div>
    </div>
  );
};

export default UploadFileLayout;
