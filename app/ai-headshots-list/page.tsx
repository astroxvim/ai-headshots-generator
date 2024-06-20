"use client";

import React, { useEffect, useState } from 'react';
import HeadshotListItem from './headshot-list-item';
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { useStore } from '../store/context-provider';

const AIHeadshotsList = () => {
  const [loading, setLoading] = useState(true);
  const [trainedImages, setTrainedImages] = useState([]);
  
  const router = useRouter();
  const store = useStore();

  const handleStartNewSession = () => {
    router.push('/');
  };

  useEffect(() => {
    let intervalId: any;

    if (!store.currentID || store.currentID == "" || store.currentID == "error") {
      clearInterval(intervalId);
      return;
    }

    intervalId = setInterval(async () => {

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
        console.log(trained_image);
      }
    }, 5000); // 1000 milliseconds = 1 second

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [store.currentID]);

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
  );
};

export default AIHeadshotsList;
