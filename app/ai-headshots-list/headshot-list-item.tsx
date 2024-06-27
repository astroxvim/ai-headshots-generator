import React from 'react';
import { Image } from "@nextui-org/react";

const HeadshotListItem = ({ headshot }) => {
  return (
    <div className="relative">
      <Image
        alt={headshot.title}
        className="rounded-lg transition-transform duration-300 hover:scale-105"
        src={headshot.src}
        width="100%"
        height="auto"
      />
      {/* <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
        <p className="text-center">{headshot.title}</p>
      </div> */}
    </div>
  );
};

export default HeadshotListItem;
