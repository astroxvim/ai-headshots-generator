"use client";

import React, { useState, useCallback, useMemo } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import MultistepSidebar from "./components/multistep-sidebar";
import SelectPreferences from "./components/select-preferences";
import UploadImage from "./components/upload-image";
import CodePay from "./components/code-pay";
import MultistepNavigationButtons from "./components/nextui/multistep-navigation-buttons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { genders } from "./constants/preference-types";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

export default function UpicApp() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedBlobs, setUploadedBlobs] = useState<string[]>([]);
  const [selectedPreference, setSelectedPreference] = useState(false);
  const [selectedGender, setSelectedGender] = useState(genders[0].key);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const paginate = useCallback((newDirection: number) => {
    setPage((prev) => {
      const nextPage = prev[0] + newDirection;
      if (nextPage < 0 || nextPage > 2) return prev;
      return [nextPage, newDirection];
    });
  }, []);

  const onChangePage = useCallback((newPage: number) => {
    setPage((prev) => {
      if (newPage < 0 || newPage > 2) return prev;
      const currentPage = prev[0];
      return [newPage, newPage > currentPage ? 1 : -1];
    });
  }, []);

  const onBack = useCallback(() => {
    if (page === 0) {
      router.push("/");
    } else {
      paginate(-1);
    }
  }, [page, paginate, router]);

  const onNext = useCallback(() => {
    paginate(1);
  }, [page, selectedPreference, uploadedFiles.length, paginate]);

  const uploadToBlob = async (): Promise<boolean> => {
    let allUploadsSuccessful = true;
    const blobUrls = [];

    setIsUploading(true);

    console.log('aaaa', uploadedFiles)

    if (uploadedFiles && uploadedFiles.length !== 0) {
      try {
        await Promise.all(uploadedFiles.map(async (file) => {
          try {
            const blob = await upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/astria/train-model/image-upload",
            });
            blobUrls.push(blob.url);
          } catch (error) {
            allUploadsSuccessful = false;
          }
        }));
      } catch (error) {
        allUploadsSuccessful = false;
      }
    } else {
      
      if (page === 0 && !selectedPreference) {
        toast.error("Please select a preference before continuing.");
      }
      if (page === 1 && (uploadedFiles.length < 4 || uploadedFiles.length > 10)) {
        toast.error("Please upload between 4 and 10 images to continue.");
      }
      setIsUploading(false);
      return false;
    }

    console.log('bbb')

    if (allUploadsSuccessful) {
      toast.success("Sample images uploaded successfully");
      setUploadedBlobs(blobUrls);
      setIsUploading(false);
      return true;
    } else {
      toast.error("Some images failed to upload. It may related to file size, please check the instructions again");
      setIsUploading(false);
      return false;
    }
  }

  const content = useMemo(() => {
    let component = (
      <SelectPreferences
        onNext={onNext}
        selectedPreference={selectedPreference}
        setSelectedPreference={setSelectedPreference}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
    );

    switch (page) {
      case 1:
        component = (
          <UploadImage
            onNext={onNext}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
        );
        break;
      case 2:
        component = (
          <CodePay
            blobUrls={uploadedBlobs}
            selectedOption={selectedOption}
            selectedGender={selectedGender}
          />
        );
        break;
    }

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={page}
          animate="center"
          className="col-span-12"
          custom={direction}
          exit="exit"
          initial="exit"
          transition={{
            y: {
              ease: "backOut",
              duration: 0.35,
            },
            opacity: { duration: 0.4 },
          }}
          variants={variants}
        >
          {component}
        </m.div>
      </LazyMotion>
    );
  }, [
    direction,
    page,
    onNext,
    selectedPreference,
    selectedGender,
    selectedOption,
    uploadedFiles,
  ]);

  return (
    <>
      <div className="bg-image"></div>
      <div className="overlay"></div>

      <div className="dark relative min-h-screen">
        <ToastContainer
          toastClassName="toast-dark"
          autoClose={3000} // Set autoClose to 3000ms (3 seconds)
        />
        <MultistepSidebar
          currentPage={page}
          onBack={onBack}
          onChangePage={onChangePage}
          onNext={onNext}
          selectedPreference={selectedPreference}
          uploadedFiles={uploadedFiles}
          selectedGender={selectedGender}
          selectedOption={selectedOption}
        >
          <div className="relative flex h-fit w-full flex-col items-center text-center lg:h-full lg:justify-center lg:pt-0">
            {content}
            {page !== 2 && (
              <MultistepNavigationButtons
                isLoading={isUploading}
                backButtonProps={{ className: "enabled-button-class lg:hidden" }}
                className="justify-center lg:flex"
                nextButtonProps={{
                  children:
                    page === 0 ? "Continue to Upload" : "Continue to Pay",
                  onClick: page === 0 ? onNext : () => {
                    uploadToBlob().then((success) => success && onNext()
                    )                    
                  },
                }}
                onBack={onBack}
              />
            )}
          </div>
        </MultistepSidebar>
      </div>
    </>
  );
}
