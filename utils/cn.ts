import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const COMMON_UNITS = ["small", "medium", "large"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
