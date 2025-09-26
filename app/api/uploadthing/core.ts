// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app
export const ourFileRouter = {
  // Main product image uploader (single image)
  mainImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Main image upload complete");
      console.log("file url", file.url);
      console.log("metadata", metadata);
      return { url: file.url };
    }),

  // Additional product images uploader (up to 3 images)
  additionalImagesUploader: f({
    image: {
      maxFileSize: "4MB", 
      maxFileCount: 3,
    },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Additional images upload complete");
      console.log("file url", file.url);
      console.log("metadata", metadata);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;