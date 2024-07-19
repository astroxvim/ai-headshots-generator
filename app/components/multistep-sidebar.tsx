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
  selectedGender?: string;
  selectedOption?: string | null;
};

const stepperClasses = cn(
  // light
  "[--step-color:hsl(var(--nextui-secondary-400))]",
  "[--active-color:hsl(var(--nextui-secondary-400))]",
  "[--inactive-border-color:hsl(var(--nextui-secondary-200))]",
  "[--inactive-bar-color:hsl(var(--nextui-secondary-200))]",
  "[--inactive-color:hsl(var(--nextui-secondary-300))]",
  // dark
  "dark:[--step-color:rgba(255,255,255,0.1)]",
  "dark:[--active-color:hsl(var(--nextui-foreground-600))]",
  "dark:[--active-border-color:rgba(255,255,255,0.5)]",
  "dark:[--inactive-border-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-bar-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-color:rgba(255,255,255,0.2)]",
);

const MultiStepSidebar = React.forwardRef<HTMLDivElement, MultiStepSidebarProps>(
  ({ children, className, currentPage, onBack, onNext, onChangePage, uploadedFiles, selectedPreference, selectedGender, selectedOption, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-screen h-[calc(110vh_-_40px)] w-full gap-x-2", className)}
        {...props}
      >
        <div className="hidden h-full w-[344px] flex-shrink-0 flex-col items-start gap-y-8 rounded-large bg-custom-vertical-gradient px-8 py-6 shadow-small lg:flex">
          <Button
            className="bg-default-50 text-small font-medium text-default-500"
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
            <div className="mt-1 text-base font-medium leading-6 text-default-500">
              Follow the simple steps to create your personalized headshots.
            </div>
          </div>
          <VerticalSteps
            className={stepperClasses}
            currentStep={currentPage}
            selectedPreference={selectedPreference}
            uploadedFiles={uploadedFiles}
            color="secondary"
            steps={[
              {
                title: "Settings",
              },
              {
                title: "Upload",
              },
              {
                title: "Pay & Generate",
              },
            ]}
            onStepChange={(stepIdx) => {
              if (stepIdx === 1 && !selectedPreference) {
                toast.error("Please select a preference before continuing.");
                return;
              }
              if (stepIdx === 2 && (uploadedFiles?.length < 4 || uploadedFiles?.length > 10)) {
                toast.error("Please upload between 4 and 10 images to continue.");
                return;
              }
              onChangePage(stepIdx);
            }}
            onClick={()=>{}}
          />
          <SupportCard className="w-full backdrop-blur-lg lg:bg-white/40 lg:shadow-none dark:lg:bg-white/20" />
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
                    title: "Upload",
                  },
                  {
                    title: "Pay & Generate",
                  },
                ]}
                onStepChange={(stepIdx) => {
                  if (stepIdx === 1 && !selectedPreference) {
                    toast.error("Please select a preference before continuing.");
                    return;
                  }
                  if (stepIdx === 2 && (uploadedFiles?.length < 4 || uploadedFiles?.length > 10)) {
                    toast.error("Please upload between 4 and 10 images to continue.");
                    return;
                  }
                  onChangePage(stepIdx);
                }}
                onClick={()=>{}}
              />
            </div>
          </div>
          <div className="h-full w-full p-4 sm:max-w-md md:max-w-lg">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

MultiStepSidebar.displayName = "MultiStepSidebar";

export default MultiStepSidebar;