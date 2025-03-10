"use client";

import React, { useCallback, useRef } from "react";
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
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const handleBrowseFilesClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <>
        <div className="flex max-w-xl flex-col text-center">
          <h2 className="font-medium text-secondary">Upload</h2>
          <h1 className="text-4xl black font-medium tracking-tight">Upload Photos</h1>
          <Spacer y={4} />
          <h2 className="text-large text-default-500">
            Provide 4 to 10 great reference photos for AI to&nbsp;train.
          </h2>
        </div>
        <Spacer y={8} />
        <form
          ref={ref}
          {...props}
          className={cn("flex w-full flex-col items-start rounded-medium text-default-500 bg-default-100/70 transition-colors hover:bg-default-100/90 border-2 border-default-200", className)}
        >
          <div {...getRootProps({ className: "group flex w-full flex-col items-center gap-2 p-4" })}>
            <input {...getInputProps()} ref={fileInputRef} />
            
            <div className="flex flex-col items-center justify-center p-4 rounded-md text-default-500">
              <Icon icon={uploadIcon} className="text-4xl mb-2" />
              <p className="text-lg">
                {isDragActive ? "Drop the files here ..." : "Drag 'n' drop files here, or"}
              </p>
              <Button className="mt-2" color="primary" variant="solid" onClick={handleBrowseFilesClick}>
                Browse Files
              </Button>
              <Spacer y={8} />

              <ul>
                <li className="flex items-center gap-1">
                  <Icon className="text-default-600 text-success" icon="ci:check" width={24} />
                  <p className="text-small text-default-500">Face centered and fully visible</p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon className="text-default-600 text-success" icon="ci:check" width={24} />
                  <p className="text-small text-default-500">Shoulders/waist-up images</p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon className="text-default-600 text-success" icon="ci:check" width={24} />
                  <p className="text-small text-default-500">Looking at camera</p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon className="text-default-600 text-warning" icon="ci:close-sm" width={24} />
                  <p className="text-small text-default-500">No group photos</p>
                </li>
                <li className="flex items-center gap-1">
                  <Icon className="text-default-600 text-warning" icon="ci:close-sm" width={24} />
                  <p className="text-small text-default-500">No face-obscuring accessories</p>
                </li>
                
                <li className="flex items-center gap-1">
                  <Icon className="text-default-600  text-warning" icon="ci:close-sm" width={24} />
                  <p className="text-small text-default-500">No same day images</p>
                </li>
              </ul>
            </div>
            <div className="group flex gap-2 px-4 pt-4 overflow-x-auto">
              {uploadedFiles.map((image, index) => (
                <Badge
                  key={index}
                  isOneChar
                  className="opacity-0 group-hover:opacity-100"
                  content={
                    <div className="relative -top-[8px] right-[8px]">
                      <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => handleDelete(index)}
                      >
                        <Icon className="text-foreground top-[6px] left-[6px]" icon="iconamoon:close-thin" width={16} />
                      </Button>
                    </div>
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
          <Spacer y={2} />
        </form>
        <Spacer y={4} />
      </>
    );
  }
);

UploadImage.displayName = "UploadImage";

export default UploadImage;
