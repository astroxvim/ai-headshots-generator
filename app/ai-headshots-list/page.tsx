"use client";

import React, { useEffect, useState } from 'react';
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useStore } from '../store/context-provider';
import HeadshotListItem from './headshot-list-item';

import JSZip from "jszip";

import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "AI is processing and generating...",
  "It may take a few minutes...",
  "Please do not close or refresh the window..."
];

const AIHeadshotsList = () => {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setDownloading] = useState(false);
  const [trainedImages, setTrainedImages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const router = useRouter();
  const store = useStore();

  const handleStartNewSession = () => {
    router.push('/');
  };

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let intervalId: any;

    if (!store.currentID || store.currentID == "" || store.currentID == "error") {
      clearInterval(intervalId);
      return;
    }

    intervalId = setInterval(async () => {

      console.log('checkID: ', store.currentID);

      const response = await fetch("/db/train-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(store.currentID),
      });
      const { trained_image } = await response.json();
      if (trained_image.length == process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT) {
        setLoading(false);
        clearInterval(intervalId);
        setTrainedImages(trained_image);
      }
    }, 5000); // 1000 milliseconds = 1 second

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [store.currentID]);

  const downloadFile = async (files: any) => {
    setDownloading(true);
    try {
      console.log(files);

      // Create a temporary URL for each file.
      const fileUrls = files.map((file: any) => file.blob);

      // Create a ZIP archive using the temporary URLs.
      const zip = new JSZip();
      fileUrls.forEach((url: RequestInfo | URL, index: string | number) => {
        zip.file(
          `${index}.jpg`,
          fetch("/astria/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(files[index].blob),
          }).then((res) => res.blob()),
          { binary: true }
        );
      });

      // Generate the ZIP file content as a blob.
      const zipContent = await zip.generateAsync({ type: "blob" });

      // Create a download link and trigger the download.
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(zipContent);
      downloadLink.download = "downloaded_images.zip";
      downloadLink.click();

      // Clean up temporary URLs.
      fileUrls.forEach((url: string) => URL.revokeObjectURL(url));

      setDownloading(false);
    } catch (error) {
      console.error("Error downloading files:", error);
      setDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="bg-image"></div>
      <div className="overlay"></div>
      <div className="content flex flex-col items-center py-12">
        <div className="w-full flex justify-center items-center mt-8 mb-4">
          <img src="/upic-logo.svg" alt="UPIC Logo" className="w-28 h-28" /> {/* Centered logo */}
        </div>
        <div className="max-w-xl text-center">
          <h2 className="font-medium text-primary">Your AI Headshots</h2><h1 className="text-4xl font-medium tracking-tight">
            {loading ? "Your images are generating..." : "Your images are ready"}
          </h1>
          <Spacer y={4} />
          <h2 className="text-large text-default-500">
            Your images are generating and it may take a few minutes. Please do not close or refresh the window.
          </h2>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.h2
                key={messageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-large text-default-500"
              >
                {messages[messageIndex]}
              </motion.h2>
            ) : (
              <motion.h2
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-large text-default-500"
              >
                Image generation is now complete.
              </motion.h2>
            )}
          </AnimatePresence>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {loading && trainedImages.length === 0 ? (
              Array(4).fill('_').map((_, index) => (
                <div key={index} className="animate-pulse flex flex-col items-center">
                  <div className="h-64 w-full bg-gray-300 rounded-lg" />
                </div>
              ))
            ) : (
              trainedImages.map((headshot, index) => (
                <React.Fragment key={headshot.id}>
                    <HeadshotListItem headshot={headshot} />
                </React.Fragment>
              ))
            )}
          </div>
          {!loading && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                className="relative overflow-hidden rounded-xlg hover:-translate-y-1 px-12 shadow-xl"
                size="lg"
                onPress={() => alert('Download images functionality')}
              >
                Download Images
              </Button>
              <Button
                className="relative overflow-hidden rounded-xlg hover:-translate-y-1 px-12 shadow-xl bg-primary text-white"
                size="lg"
                onPress={handleStartNewSession}
              >
                Start New Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHeadshotsList;
