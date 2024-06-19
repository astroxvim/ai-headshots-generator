"use client";

import React, { useEffect, useState } from 'react';
import HeadshotListItem from './headshot-list-item';
import { headshots } from '../constants/headshots';
import { Button, Spacer } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

const AIHeadshotsList = () => {
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const router = useRouter();

  const handleStartNewSession = () => {
    router.push('/');
  };

  useEffect(() => {
    const loadImagesSequentially = async (index = 0) => {
      if (index < headshots.length) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate 5-second loading delay
        setLoadedImages((prev) => [...prev, index]);
        loadImagesSequentially(index + 1);
      } else {
        setLoading(false);
      }
    };

    loadImagesSequentially();
  }, []);

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
          {loading && loadedImages.length === 0 ? (
            Array.from({ length: headshots.length }).map((_, index) => (
              <div key={index} className="animate-pulse flex flex-col items-center">
                <div className="h-64 w-full bg-gray-300 rounded-lg" />
              </div>
            ))
          ) : (
            headshots.map((headshot, index) => (
              <React.Fragment key={headshot.id}>
                {loadedImages.includes(index) ? (
                  <HeadshotListItem headshot={headshot} />
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
