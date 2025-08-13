import { UploadNestClient } from "@uploadnest/client";
import { NextRequest, NextResponse } from "next/server";

const client = new UploadNestClient({
  apiKey: process.env.UPLOADNEST_API_KEY!,
  forceBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const formData = await request.formData();
    const files = formData.getAll("files");

    // Validate files
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    console.log("Files to upload:", files);

    // Upload files using UploadNest client
    const result = await client.uploadFiles(files);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload API error:", error);

    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
