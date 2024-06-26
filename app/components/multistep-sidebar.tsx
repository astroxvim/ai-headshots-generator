// app/components/multistep-sidebar.tsx
"use client";

import React from "react";
import { Button, Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "../utils/cn";
import SupportCard from "./support-card";
import VerticalSteps from "./nextui/vertical-steps";
import RowSteps from "./nextui/row-steps";
import MultistepNavigationButtons from "./nextui/multistep-navigation-buttons";
import { toast, ToastContainer } from 'react-toastify';

export type MultiStepSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  currentPage: number;
  onBack: () => void;
  onNext: () => void;
  onChangePage: (page: number) => void;
  uploadedFiles?: File[];
  selectedPreference?: boolean;
};

const stepperClasses = cn(
  // light
    "[--step-color:#50defb]",
    "[--active-color:#50defb]",
    "[--inactive-border-color:#20A6C1]",
    "[--inactive-bar-color:#20A6C1]",
    "[--inactive-color:#20A6C1]",
  // dark
    // "dark:[--step-color:rgba(255,255,255,0.1)]",
    // "dark:[--active-color:hsl(var(--nextui-foreground-600))]",
    // "dark:[--active-border-color:rgba(255,255,255,0.5)]",
    // "dark:[--inactive-border-color:rgba(255,255,255,0.1)]",
    // "dark:[--inactive-bar-color:rgba(255,255,255,0.1)]",
    // "dark:[--inactive-color:rgba(255,255,255,0.2)]",
);

const MultiStepSidebar = React.forwardRef<HTMLDivElement, MultiStepSidebarProps>(
  ({ children, className, currentPage, onBack, onNext, onChangePage, uploadedFiles, selectedPreference, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-screen p-[24px] w-full gap-x-2", className)}
        {...props}
      >
        <div className="hidden h-[100vh-48px] w-[344px] flex-shrink-0 flex-col items-start gap-y-8 rounded-large bg-custom-vertical-gradient px-8 py-6 shadow-small lg:flex">
          <Button
            className="bg-black text-small font-medium text-neutral-50"
            radius="full"
            variant="flat"
            onPress={onBack}
          >
            <Icon icon="solar:arrow-left-outline" width={18} />
            Back
          </Button>
          <div>
            <div className="text-xl font-medium leading-7 text-default-foreground flex items-center">
              <img src="/upic-logo.svg" alt="Logo" className="w-24 h-24" /> {/* Add your logo here */}
              <Chip color="warning" variant="flat" className="ml-2">
                PREVIEW
              </Chip>
            </div>
            <div className="mt-1 text-base font-medium leading-6 text-neutral-400">
              Follow the simple steps to create your professional headshots.
            </div>
          </div>
          <VerticalSteps
            className={stepperClasses}
            currentStep={currentPage}
            selectedPreference={selectedPreference}
            uploadedFiles={uploadedFiles}
            steps={[
              {
                title: "Select Settings",
              },
              {
                title: "Upload Images",
              },
              {
                title: "Pay $1 to Generate",
              },
            ]}
            onStepChange={(stepIdx) => {
              if (stepIdx === 1 && !selectedPreference) {
                toast.error("Please select a preference before continuing.", {
                  className: "toast-dark",
                });
                return;
              }
              if (stepIdx === 2 && (uploadedFiles?.length < 4 || uploadedFiles?.length > 10)) {
                toast.error("Please upload between 4 and 10 images to continue.", {
                  className: "toast-dark",
                });
                return;
              }
              onChangePage(stepIdx);
            }}
          />
          <SupportCard className="w-full backdrop-blur-lg lg:bg-black lg:shadow-none dark:lg:bg-black" />
        </div>
        <div className="flex h-full w-full flex-col items-center gap-4 md:p-4">
          <div className="sticky top-0 z-10 w-full rounded-large bg-custom-horizontal-gradient from-default-100 via-danger-100 to-secondary-100 py-4 shadow-small md:max-w-xl lg:hidden">
            <div className="flex justify-center">
              <RowSteps
                className={cn("pl-6", stepperClasses)}
                currentStep={currentPage}
                selectedPreference={selectedPreference}
                uploadedFiles={uploadedFiles}
                steps={[
                  {
                    title: "Settings",
                  },
                  {
                    title: "References",
                  },
                  {
                    title: "Payment",
                  },
                ]}
                onStepChange={(stepIdx) => {
                  if (stepIdx === 1 && !selectedPreference) {
                    toast.error("Please select a preference before continuing.", {
                      className: "toast-dark",
                    });
                    return;
                  }
                  if (stepIdx === 2 && (uploadedFiles?.length < 4 || uploadedFiles?.length > 10)) {
                    toast.error("Please upload between 4 and 10 images to continue.", {
                      className: "toast-dark",
                    });
                    return;
                  }
                  onChangePage(stepIdx);
                }}
              />
            </div>
          </div>
          <div className="h-full w-full p-4">
            {children}
            {currentPage !== 2 && ( // Ensure no button on page 2 for mobile view
              <MultistepNavigationButtons
                backButtonProps={{ className: "enabled-button-class" }}
                className="lg:hidden"
                nextButtonProps={{
                  children:
                    currentPage === 0
                      ? "Continue to Upload Images"
                      : currentPage === 1
                      ? "Go to Payment"
                      : null,
                  onClick: onNext,
                }}
                onBack={onBack}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

MultiStepSidebar.displayName = "MultiStepSidebar";

export default MultiStepSidebar;
