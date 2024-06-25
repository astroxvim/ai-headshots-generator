"use client";

import React, { useEffect, useState } from 'react';
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useStore } from '../store/context-provider';
import HeadshotListItem from './headshot-list-item';

import JSZip from "jszip";

const AIHeadshotsList = () => {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setDownloading] = useState(false);
  const [trainedImages, setTrainedImages] = useState([]);
  
  const router = useRouter();
  const store = useStore();

  const handleStartNewSession = () => {
    router.push('/');
  };

  useEffect(() => {

    setLoading(true);
    setTrainedImages(store.trainedImages);

    setTimeout(() => {
      if( store.trainedImages.length !== 0 ) setLoading(false);
    }, 1000);

    console.log('trained:', trainedImages);
  }, [store.trainedImages]);

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
    <div className="flex flex-col items-center py-12">
      <div className="max-w-xl text-center">
        <h2 className="font-medium text-upic-primary">Your AI Headshots</h2>
        <h1 className="text-4xl font-medium tracking-tight text-neutral-300">Here are your generated headshots</h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Your images are generating and it may take a few minutes. Please do not close or refresh the window.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {loading && trainedImages.length === 0 ? (
            Array(4).fill('_').map((_, index) => (
              <div key={index} className="animate-pulse flex flex-col items-center">
                <div className="h-64 w-full bg-gray-300 rounded-lg" />
              </div>
            ))
          ) : (
            trainedImages.map((trainedImage, index) => (
              <React.Fragment key={index}>
                {trainedImages.includes(index) ? (
                  <HeadshotListItem headshot={{ title: index, src: trainedImage?.blob }} />
                ) : (
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-64 w-full bg-gray-300 rounded-lg" />
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
        {!loading && (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              className="relative bg-black/90 overflow-hidden rounded-xlg hover:-translate-y-1 px-12 shadow-xl"
              size="lg"
              isLoading={isDownloading}
              onPress={() => downloadFile(trainedImages)}
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
  );
};

export default AIHeadshotsList;
