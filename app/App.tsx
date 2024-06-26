"use client";

import React, { useState, useCallback, useMemo } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import MultistepSidebar from "./components/multistep-sidebar";
import SelectPreferences from "./components/select-preferences";
import UploadImage from "./components/upload-image";
import CodePay from "./components/code-pay";
import MultistepNavigationButtons from "./components/nextui/multistep-navigation-buttons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [selectedPreference, setSelectedPreference] = useState(false);

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
    paginate(-1);
  }, [paginate]);

  const onNext = useCallback(
    () => {
    console.log('onNext', selectedPreference);
    if (page === 0 && !selectedPreference) {
      toast.error("Please select a preference before continuing.", { className: 'toast-dark' });
      return;
    }
    if (page === 1 && (uploadedFiles.length < 4 || uploadedFiles.length > 10)) {
      toast.error("Please upload between 4 and 10 images to continue.", { className: 'toast-dark' });
      return;
    }
    paginate(1);
  }, [page, selectedPreference, uploadedFiles.length, paginate]);

  const content = useMemo(() => {
    let component = (
      <SelectPreferences
        onNext={onNext}
        selectedPreference={selectedPreference}
        setSelectedPreference={setSelectedPreference}
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
        component = <CodePay files={uploadedFiles} />;
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
  }, [direction, page, onNext, selectedPreference, uploadedFiles]);

  return (
    <>
      <MultistepSidebar
        currentPage={page}
        onBack={onBack}
        onChangePage={onChangePage}
        onNext={onNext}
        selectedPreference={selectedPreference}
        uploadedFiles={uploadedFiles}
      >
        <div className="relative flex h-fit w-full flex-col items-center pt-6 text-center lg:h-full lg:justify-center lg:pt-0">
          {content}
          {page !== 2 && (
            <MultistepNavigationButtons
              backButtonProps={{ className: "enabled-button-class" }}
              className="hidden justify-center lg:flex"
              nextButtonProps={{
                children:
                  page === 0
                    ? "Continue to Upload Images"
                    : page === 1
                    ? "Go to Payment"
                    : null, // Ensure no button on page 2
                onClick: onNext,
              }}
              onBack={onBack}
            />
          )}
        </div>
        <ToastContainer />
      </MultistepSidebar>
    </>
  );
}
