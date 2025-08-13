"use server";
import { UploadNestClient } from "@uploadnest/client";

const client = new UploadNestClient({
  apiKey: process.env.UPLOADNEST_API_KEY!,
  forceBrowser: true,
});

export async function uploadAction(formData: FormData) {
  try {
    // Get files from form data
    const files = formData.getAll("files");
    // Validate files
    if (!files || files.length === 0) {
      return { error: "No files provided" };
    }

    // Upload files using UploadNest client
    const result = await client.uploadFiles(files);

    return result;
  } catch (error: any) {
    console.error("Server Action upload error:", error);

    return {
      error: error?.message || "Upload failed",
    };
  }
}
