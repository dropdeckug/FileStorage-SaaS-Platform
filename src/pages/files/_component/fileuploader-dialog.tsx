/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploader, type FileUploaderRef } from "@/components/file-uploader";

export const FileUploaderDialog = (props: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Use File[] directly
  const fileUploaderRef = useRef<FileUploaderRef>(null);

  const handleFileUpload = useCallback(async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90% success rate for demonstration
          const newAsset: any = {
            id: `${file.name}-${Date.now()}`,
            originalName: file.name,
            url: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : "/placeholder.svg?height=40&width=40",
            mimeType: file.type || "application/octet-stream",
            ext: file.name.split(".").pop()?.toUpperCase() || "BIN",
            size: file.size,
            uploadedVia: "web upload",
            createdAt: new Date(),
          };
          resolve(newAsset);
        } else {
          reject(new Error("Simulated upload failure."));
        }
      }, 2000); // Simulate 2-second upload time
    });
  }, []);

  const handleUploadButtonClick = async () => {
    if (selectedFiles.length === 0) {
      toast.info("Please select files to upload.");
      return;
    }
    setIsOpen(false); // Close the dialog immediately

    const totalFiles = selectedFiles.length;
    let uploadedCount = 0;
    let failedCount = 0;
    const successfulUploads: any[] = [];

    const toastId = toast.loading(`Uploading ${totalFiles} file(s)...`, {
      description: "Starting upload process...",
      duration: Number.POSITIVE_INFINITY, // Keep toast open until updated
    });

    for (const file of selectedFiles) {
      toast.loading(
        `Uploading "${file.name}" (${uploadedCount + 1}/${totalFiles})...`,
        {
          id: toastId, // Update the existing toast
          description: "Please wait, your file is being processed.",
          duration: Number.POSITIVE_INFINITY,
        }
      );
      try {
        const result = await handleFileUpload(file);
        successfulUploads.push(result);
        uploadedCount++;
      } catch (error) {
        console.log(error);
        failedCount++;
        // Optionally, you could update the toast description to list failed files
      }
    }
    // Final update to the toast
    if (failedCount === 0) {
      toast.success(`All ${totalFiles} file(s) uploaded successfully!`, {
        id: toastId,
        description: "Your files are now available.",
        duration: 3000, // Show success for 3 seconds
      });
    } else if (uploadedCount > 0) {
      toast.warning(
        `Uploaded ${uploadedCount} of ${totalFiles} files. ${failedCount} failed.`,
        {
          id: toastId,
          description: "Some files could not be uploaded.",
          duration: 5000, // Show warning for 5 seconds
        }
      );
    } else {
      toast.error(`All ${totalFiles} file(s) failed to upload.`, {
        id: toastId,
        description: "Please try again later.",
        duration: 5000, // Show error for 5 seconds
      });
    }
    fileUploaderRef.current?.clearSelectedFiles(); // Clear files in the uploader component
    setSelectedFiles([]); // Clear files in dialog state
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
        </DialogHeader>
        <div className="py-4 w-full">
          <FileUploader
            ref={fileUploaderRef}
            onFilesSelected={setSelectedFiles} // Update dialog's state with selected files
            maxFileSize={100 * 1024 * 1024} // 100MB
            acceptedFileTypes={{
              "image/*": [".jpeg", ".png", ".gif", ".svg", ".jpg"],
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/vnd.ms-excel": [".xls"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
              "application/vnd.ms-powerpoint": [".ppt"],
              "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                [".pptx"],
              "application/zip": [".zip"],
              "application/x-rar-compressed": [".rar"],
              "application/x-tar": [".tar"],
              "text/plain": [".txt"],
            }}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleUploadButtonClick}
            className="hover:bg-primay/80 cursor-pointer text-white w-full disabled:opacity-80 disabled:cursor-not-allowed"
            disabled={selectedFiles.length === 0}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
