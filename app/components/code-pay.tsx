"use client";

import type { CardProps } from "@nextui-org/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  Image,
  CardBody,
  CardFooter,
  Link,
  Spacer,
  Button,
} from "@nextui-org/react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import code from "@code-wallet/elements";
import { nanoid } from "nanoid";
import { useStore } from "../store/context-provider";
import { toast } from "react-toastify";

type CodePayProps = CardProps & {
  files: File[];
  selectedOption: string;
  selectedGender: string;
};

const CodePay = ({ files, selectedOption, selectedGender, ...props }: CodePayProps) => {
  const router = useRouter();
  const store = useStore();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const codePayRef = useRef<HTMLDivElement>(null);

  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { button } = code.elements.create("button", {
      currency: "usd",
      destination: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
      amount: parseFloat(process.env.NEXT_PUBLIC_PRICE ?? ""),
      appearance: "light",
    });

    if (button) {
      button.on("success", (args: any): Promise<boolean | void> => {
        setIsPaid(true);
        toast.success(`$${process.env.NEXT_PUBLIC_PRICE} paid successfully.`);
        return Promise.resolve(true);
      });

      button.on("cancel", (args: any): Promise<boolean | void> => {
        setIsPaid(false);
        return Promise.resolve(true);
      });

      button.mount(codePayRef.current!);
    }
    store.setTrainedImages([]);
  }, []);

  const submitModel = useCallback(async () => {
    setIsLoading(true);

    const blobUrls = [];
    let allUploadsSuccessful = true;

    console.log('files', files);

    if (files) {
      for (const file of files) {
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/astria/train-model/image-upload",
          });
          blobUrls.push(blob.url);
        } catch (error) {
          allUploadsSuccessful = false;
          console.error(`Failed to upload image ${file.name}:`, error);
        }
      }
    }

    if (allUploadsSuccessful) {
      toast.success("All images processed successfully.");
    } else {
      toast.error("Some images failed to upload.");
    }

    const payload = {
      id: nanoid(),
      urls: blobUrls,
      gender: selectedGender,
      option: selectedOption,
    };

    console.log('nanoID: ', payload.id);

    try {
      const response = await fetch("astria/train-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (response.status == 200) {
        store.setCurrentID({ currentID: payload.id });
        toast.success("The model is queued for training.");
        router.push('/ai-headshots-list');
      } else {
        const { message } = await response.json();
        toast.error("Something went wrong! " + message);
        console.log("Something went wrong!", message);
      }
    } catch (e) {
      toast.error("ERROR: " + e.message);
      console.log('ERROR:', e);
    } finally {
      setIsLoading(false);
    }
  }, [files, selectedGender, selectedOption, store, router]);

  const handleConfetti = () => {
    submitModel();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      confetti({
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    }
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #6645EB, #5c39db)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    color: "white",
  };

  return (
    <div className="flex flex-col items-center py-12">
      <div className="flex max-w-xl flex-col text-center">
        <h2 className="font-medium text-secondary">Pay & Generate</h2>
        <h1 className="text-4xl font-medium tracking-tight">Pay ${process.env.NEXT_PUBLIC_PRICE} to Generate</h1>
        <Spacer y={4} />
        <h2 className="text-large text-default-500">
          Simply pay for what you use. No strings attached.
        </h2>
      </div>
      <Spacer y={8} />
      {!isPaid ? (
        <div>
          <div ref={codePayRef}></div>
        </div>
      ) : (
        <Button
          ref={buttonRef}
          disableRipple
          className="relative overflow-visible rounded-xlg hover:-translate-y-1 px-12 shadow-xl"
          size="lg"
          style={buttonStyle}
          isLoading={isLoading}
          onPress={handleConfetti}
        >
          { isLoading ? "Processing..." : "Generate Your Headshot" }
        </Button>
      )}
      <Spacer y={12} />
      <Card className="w-full max-w-[420px] sm:w-[420px]" {...props}>
        <CardBody className="px-3 pb-1">
          <Image
            alt="Card image"
            className="aspect-video w-full object-cover object-top"
            src="./getcode.png"
          />
          <Spacer y={2} />
          <div className="flex flex-col gap-2 px-2">
            <p className="text-large font-medium">Pay Securely with Code</p>
            <p className="text-small text-default-400">
              Get{" "}
              <Link
                className="mx-1 text-secondary text-small underline"
                href="https://getcode.com/"
                target="_blank"
              >
                Code Wallet
              </Link>
              to pay easily and securely, without any credit card info. With
              Code, you have complete control over your transactions&mdash;quick,
              private, and global payments in over 100 currencies.
            </p>
          </div>
        </CardBody>
        <CardFooter className="justify-end gap-2"></CardFooter>
      </Card>
    </div>
  );
};

export default CodePay;
