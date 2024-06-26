import type { ButtonProps } from "@nextui-org/react";

export enum ServiceEnum {
  Professional = "professional",
  Creative = "creative",
}

export type Service = {
  key: ServiceEnum;
  title: string;
  price: string;
  priceSuffix: string;
  description?: string;
  features?: string[];
  buttonText: string;
  imageUrl: string;
  buttonColor?: ButtonProps["color"];
  buttonVariant?: ButtonProps["variant"];
  mostPopular?: boolean;
};
