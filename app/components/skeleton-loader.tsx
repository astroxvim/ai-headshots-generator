import React from 'react';
import { Card, Skeleton } from "@nextui-org/react";

const SkeletonLoader = () => {
  return (
    <Card className="relative">
      <Skeleton className="w-full h-48 rounded-lg" />
      <Skeleton className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black to-transparent" />
    </Card>
  );
};

export default SkeletonLoader;
