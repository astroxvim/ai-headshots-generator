"use client";

import React from "react";
import { AvatarGroup, Avatar, Button } from "@nextui-org/react";
import { cn } from "../utils/cn";

// Define the custom LineMdTwitterX component
export function LineMdTwitterX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M1 2h2.5L3.5 2h-2.5z">
          <animate fill="freeze" attributeName="d" dur="0.4s" values="M1 2h2.5L3.5 2h-2.5z;M1 2h2.5L18.5 22h-2.5z"></animate>
        </path>
        <path d="M5.5 2h2.5L7.2 2h-2.5z">
          <animate fill="freeze" attributeName="d" dur="0.4s" values="M5.5 2h2.5L7.2 2h-2.5z;M5.5 2h2.5L23 22h-2.5z"></animate>
        </path>
        <path d="M3 2h5v0h-5z" opacity={0}>
          <set attributeName="opacity" begin="0.4s" to={1}></set>
          <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.4s" values="M3 2h5v0h-5z;M3 2h5v2h-5z"></animate>
        </path>
        <path d="M16 22h5v0h-5z" opacity={0}>
          <set attributeName="opacity" begin="0.4s" to={1}></set>
          <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.4s" values="M16 22h5v0h-5z;M16 22h5v-2h-5z"></animate>
        </path>
        <path d="M18.5 2h3.5L22 2h-3.5z" opacity={0}>
          <set attributeName="opacity" begin="0.5s" to={1}></set>
          <animate fill="freeze" attributeName="d" begin="0.5s" dur="0.4s" values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z"></animate>
        </path>
      </g>
    </svg>
  );
}

export type SupportCardProps = React.HTMLAttributes<HTMLDivElement>;

const SupportCard = React.forwardRef<HTMLDivElement, SupportCardProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        "align-center my-2 flex shrink-0 items-center justify-center gap-3 self-stretch rounded-large bg-content1 px-3 py-3 shadow-small",
        className
      )}
    >
      <AvatarGroup isBordered size="sm">
        <Avatar
          classNames={{
            base: "ring-0 ring-offset-1 w-[25px] h-[25px]",
          }}
          src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/d958cf406bb83c3c0a93e2f03fcb0bef.jpg"
        />
        <Avatar
          classNames={{
            base: "ring-0 ring-offset-1 w-[25px] h-[25px]",
          }}
          src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/3a906b3de8eaa53e14582edf5c918b5d.jpg"
        />
        <Avatar
          classNames={{
            base: "ring-0 ring-offset-1 w-[25px] h-[25px]",
          }}
          src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/f4d075c1fa8155478e5bb26aaae69fc1.jpg"
        />
      </AvatarGroup>
      <div className="line-clamp-2 text-left text-tiny font-medium text-default-700">
        We're adding new features. Stay tuned!
      </div>
      <Button
        as="a"
        href="https://x.com/UPIC_AI"
        target="_blank"
        rel="noopener noreferrer"
        className="align-center flex h-[32px] w-[31px] justify-center rounded-[12px] bg-default-100 dark:bg-[#27272A]/[.4]"
        size="sm"
        variant="flat"
        isIconOnly
      >
        <LineMdTwitterX
          className="text-default-400 dark:text-foreground [&>g>path:nth-child(1)]:stroke-[3px] [&>g>path:nth-child(2)]:stroke-[2.5px]"
          width={18}
          height={18} // Increased the size to make it bigger
        />
      </Button>
    </div>
  )
);

SupportCard.displayName = "SupportCard";

export default SupportCard;
