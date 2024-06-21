"use client";

import React, { useCallback } from "react";
import { Spacer, Badge, Image, Button } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { cn } from "../utils/cn";
import { Icon } from '@iconify/react';
import uploadIcon from '@iconify/icons-mdi/folder-user-outline';

export type UploadImageProps = {
  onNext: () => void;
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  uploadedFiles: File[];
} & React.HTMLAttributes<HTMLFormElement>;

const UploadImage = React.forwardRef<HTMLFormElement, UploadImageProps>(
  ({ className, setUploadedFiles, uploadedFiles, ...props }, ref) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => (file)),
      ]);
    }, [setUploadedFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/*": [],
      },
    });

    const handleDelete = (index: number) => {
      setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
      <>
        <div className="flex max-w-xl flex-col text-center">
          <h2 className="font-medium text-upic-primary">References</h2>
          <h1 className="text-4xl text-neutral-300 font-medium tracking-tight">Upload Your Images</h1>
          <Spacer y={4} />
          <h2 className="text-large text-default-500">
          Provide clear face photos for accurate AI generation.
          </h2>
        </div>
        <Spacer y={8} />
        <form
          ref={ref}
          {...props}
          className={cn("flex w-full flex-col items-start rounded-medium text-default-500 bg-black/90 transition-colors cursor-pointer hover:bg-black/70 border-2 border-default-100", className)}
        >
          <div {...getRootProps({ className: "group flex w-full flex-col items-center gap-2 p-4" })}>
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center justify-center p-4 rounded-md text-default-500">
              <Icon icon={uploadIcon} className="text-4xl mb-2" />
              <p className="text-lg">
                {isDragActive ? "Drop the files here ..." : "Drag 'n' drop files here, or click to select files"}
              </p>
              <Spacer y={2} />

              <ul className="mt-2 text-sm text-default-400 space-y-1 text-center">
                <li><strong>Upload Tips:</strong></li>
                <li>Ensure your face is centered and fully visible.</li>
                <li>No group photos—only your face should be in the frame.</li>
                <li>Avoid wearing accessories that obscures your face.</li>
                <li>Upload between 4-10 images for the best results.</li>
                <li>Supported Formats: JPG, PNG, and BMP.</li>
                <li>Max File Size: 5MB per image.</li>
              </ul>
            </div>
            <div className="group flex gap-2 px-4 pt-4">
            {uploadedFiles.map((image, index) => (
              <Badge
                key={index}
                isOneChar
                className="opacity-0 group-hover:opacity-100"
                content={
                  <Button
                    isIconOnly
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => handleDelete(index)}
                  >
                    <Icon className="text-foreground" icon="iconamoon:close-thin" width={16} />
                  </Button>
                }
              >
                <Image
                  alt="uploaded image cover"
                  className="h-14 w-14 rounded-small border-small border-default-200/50 object-cover"
                  src={URL.createObjectURL(image)}
                />
              </Badge>
            ))}
            
          </div>
          </div>
          <Spacer y={8} />
        </form>
      </>
    );
  }
);

UploadImage.displayName = "UploadImage";

export default UploadImage;
