"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { services } from "../constants/ai-service-tiers";
import { ServiceEnum } from "../constants/ai-service-types";
import { cn } from "../utils/cn";

const IntroPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/multistep');
  };

  return (
    <div className="dark relative flex flex-col items-center justify-center min-h-screen py-0">
      <div
        aria-hidden="true"
        className="px:5 absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl md:right-20 md:h-auto md:w-auto md:px-36"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#1FC5DB] to-[#9A28E6] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="w-full flex justify-center items-center mt-8 mb-4">
        <img src="/upic-logo.svg" alt="UPIC Logo" className="w-28 h-28" /> {/* Centered logo */}
      </div>
      <div className="flex flex-col items-center text-center z-10">
      <h1 className="inline bg-gradient-to-br from-foreground-800 to-foreground-600 bg-clip-text text-6xl font-semibold tracking-tight text-transparent dark:to-foreground-400">
          Welcome to UPIC&nbsp;AI
        </h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Select the best service for your needs.
        </h2>
        <Spacer y={12} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 z-10">
        {services.map((service) => (
          <Card
            key={service.key}
            isBlurred
            className={cn("overflow-visible bg-background/60 p-3 dark:bg-default-100/50 shadow-large", {
              "border-2 border-primary/100": service.mostPopular,
              "opacity-70": service.key === ServiceEnum.Creative // Apply opacity to the second card
            })}
            shadow="md"
          >
            {service.mostPopular ? (
              <Chip
                classNames={{
                  base: "absolute -top-3 left-1/2 -translate-x-1/2 bg-primary shadow-large border-medium border-primary",
                  content: "font-small text-default-500 text-small text-color-primary",
                }}
                color="primary"
              >
                PREVIEW
              </Chip>
            ) : null}
            <img src={service.imageUrl} alt="Service Image" className="w-full h-32 object-cover rounded-t-lg" />
            <CardHeader className="flex flex-col items-start gap-2 pb-6 pt-4">
              <h2 className="text-large font-medium">{service.title}</h2>
              <p className="text-medium text-default-500">{service.description}</p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-8">
              <p className="flex items-baseline gap-1 pt-2">
                <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-transparent">
                  {service.price}
                </span>
                <span className="text-small font-medium text-default-400">
                  / {service.priceSuffix || 'service'}
                </span>
              </p>
              <ul className="flex flex-col gap-2">
                {service.features?.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Icon className="text-primary" icon="ci:check" width={24} />
                    <p className="text-default-500">{feature}</p>
                  </li>
                ))}
              </ul>
            </CardBody>
            <CardFooter>
              <Button
                fullWidth
                color={service.buttonColor as any}
                onPress={service.key === ServiceEnum.Professional ? handleGetStarted : undefined}
                isDisabled={service.key === ServiceEnum.Creative}
                variant={service.buttonVariant as any}
              >
                {service.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default IntroPage;
