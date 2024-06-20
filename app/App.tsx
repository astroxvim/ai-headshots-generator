"use client";

import React, { useState, useCallback, useMemo } from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import MultistepSidebar from "./components/multistep-sidebar";
import SelectPreferences from "./components/select-preferences";
import UploadImage from "./components/upload-image";
import CodePay from "./components/code-pay";
import MultistepNavigationButtons from "./components/nextui/multistep-navigation-buttons";

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
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
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

  const onNext = useCallback(() => {
    paginate(1);
  }, [paginate]);

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
    <MultistepSidebar
      currentPage={page}
      onBack={onBack}
      onChangePage={onChangePage}
      onNext={onNext}
    >
      <div className="relative flex h-fit w-full flex-col items-center pt-6 text-center lg:h-full lg:justify-center lg:pt-0">
        {content}
        {page !== 2 && (
          <MultistepNavigationButtons
            backButtonProps={{ isDisabled: page === 0 }}
            className="hidden justify-center lg:flex"
            nextButtonProps={{
              children:
                page === 0
                  ? "Continue to Upload Images"
                  : page === 2
                  ? "Generate Your Headshot"
                  : "Continue to Payment",
              isDisabled:
                page === 0
                  ? !selectedPreference
                  : page === 1 &&
                    (uploadedFiles.length < 4 || uploadedFiles.length > 10),
            }}
            onBack={onBack}
            onNext={onNext}
          />
        )}
      </div>
    </MultistepSidebar>
  );
}
