"use client";

import React, { useEffect, useState } from 'react';
import { Button, Spacer, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useStore } from '../store/context-provider';
import HeadshotListItem from './headshot-list-item';

import JSZip from "jszip";

import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "AI is processing and generating...",
  "Generation takes between 4-8 minutes...",
  "Please be patient...",
  "Your photos are getting a professional makeover!",
  "We’re enhancing every pixel just for you...",
  "Hang tight! Great images are on the way...",
  "Generation takes between 4-8 minutes...",
  "Almost there, your enhanced photos are coming...",
  "The magic of AI is at work...",
  "Skipping the hassle of makeup and wardrobe...",
  "Transforming your photos into stunning visuals...",
  "Generation takes between 4-8 minutes...",
  "Good things come to those who wait...",
  "No need for an expensive photo shoot...",
  "Just a little longer for a professional look...",
  "AI is working its magic...",
  "Saving you time and money on photo shoots...",
  "Thanks for your patience...",
  "Generation takes between 4-8 minutes...",
  "No need to book a photographer...",
  "Hold tight, your photos are worth the wait...",
  "A lot faster and cheaper than a studio session...",
];

const AIHeadshotsList = () => {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setDownloading] = useState(false);
  const [trainedImages, setTrainedImages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [hasID, setHasID] = useState(false);

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
    let intervalId;

    if (!store.currentID || store.currentID === "" || store.currentID === "error") {
      clearInterval(intervalId);
      setHasID(false);
      return;
    }

    setHasID(true);
    
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
    }, 5000);

    return () => clearInterval(intervalId);
  }, [store.currentID]);

  const downloadFile = async (files) => {
    setDownloading(true);
    try {
      console.log(files);

      const fileUrls = files.map(file => file.blob);

      const zip = new JSZip();
      fileUrls.forEach((url, index) => {
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

      const zipContent = await zip.generateAsync({ type: "blob" });

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(zipContent);
      downloadLink.download = "downloaded_images.zip";
      downloadLink.click();

      fileUrls.forEach(url => URL.revokeObjectURL(url));

      setDownloading(false);
    } catch (error) {
      console.error("Error downloading files:", error);
      setDownloading(false);
    }
  };

  return (
    <div className="dark relative min-h-screen">
      <div className="bg-image"></div>
      <div className="overlay"></div>
      <div className="content flex flex-col items-center">
        <div className="w-full flex justify-center items-center mt-8 mb-4">
          <img src="/upic-logo.svg" alt="UPIC Logo" className="w-28 h-28" />
        </div>
        { hasID ? <div className="max-w-xl text-center">
          <h2 className="font-medium text-secondary">{loading ? "ETA: 4-8 Minutes" : "AI Headshots"}</h2>
          <h1 className="text-4xl font-medium tracking-tight">
            {loading ? "Your images are generating..." : "Your images are ready"}
          </h1>
          <Spacer y={4} />
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
                  <div className="h-64 w-full bg-gray-800 rounded-lg" />
                </div>
              ))
            ) : (
              trainedImages.map((headshot, index) => (
                <React.Fragment key={headshot.id}>
                  <HeadshotListItem headshot={{ title: index, src: headshot?.blob }} />
                </React.Fragment>
              ))
            )}
          </div>
          {!loading && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                className="relative overflow-hidden rounded-xlg hover:-translate-y-1 px-12 shadow-xl"
                size="lg"
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
        </div> : 
        <div className='flex flex-col items-center gap-8'>
          <h2 className="font-medium text-secondary">You don't have any pre-generated images yet, please start a new session</h2>
          <Button
            className="relative overflow-hidden rounded-xlg hover:-translate-y-1 px-12 shadow-xl bg-primary text-white"
            size="lg"
            onPress={handleStartNewSession}
          >
            Start New Session
          </Button> 
        </div> }
      </div>
    </div>
  );
};

export default AIHeadshotsList;
