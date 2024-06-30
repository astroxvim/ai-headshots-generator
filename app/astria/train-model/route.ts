import { PreferenceEnum } from "@/app/constants/preference-types";
import prisma from "@/lib/prisma";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  const payload = await request.json();
  const images = payload.urls;
  const gender = payload.gender;
  const option = payload.option;
  const id = payload.id;

  const newimageGeneration = await prisma.imageGeneration.create({
    data: {
      gid: id,
      blobUrls: images,
      status: "pending",
      count: 8,
    },
  });

  if (!astriaApiKey) {
    return NextResponse.json(
      {
        message: "Missing API Key: Add your Astria API Key to generate headshots",
      },
      {
        status: 500,
      }
    );
  }

  if (images?.length < (process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MIN ?? 0)) {
    return NextResponse.json(
      {
        message: `Upload more than ${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MIN} sample images`,
      },
      { status: 500 }
    );
  }

  const trainWebhook = `https://${process.env.DEPLOYMENT_URL}/astria/train-webhook`;
  const trainWebhookWithParams = `${trainWebhook}?user_id=${id}&webhook_secret=${appWebhookSecret}`;

  const promptWebhook = `https://${process.env.DEPLOYMENT_URL}/astria/prompt-webhook`;
  const promptWebhookWithParams = `${promptWebhook}?user_id=${id}&webhook_secret=${appWebhookSecret}`;

  const API_KEY = astriaApiKey;
  const DOMAIN = "https://api.astria.ai";

  const numImagesPerPrompt = Math.ceil(
    parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8") / 2
  );

  const body = {
    tune: {
      title: "test",
      base_tune_id: 690204,
      name: gender,
      branch: astriaTestModeIsOn ? "fast" : "sd15",
      token: "ohwx",
      image_urls: images,
      callback: trainWebhookWithParams,
      prompts_attributes:
        option == PreferenceEnum.StudioMale
          ? [
              {
                text: `8k ultra close-up linkedin profile picture of ohwx ${gender}, professional studio setting, plain solid color background, in a buttoned shirt, hyper-realistic, 8k resolution, razor-sharp focus, natural warm skin tones, high dynamic range, clean background`,
                negative_prompt: 'sad, severe, 3d, cg, cartoonish, unnatural lighting, objects, furniture, props, text, logos, busy backgrounds',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                num_images: numImagesPerPrompt,
              },
              {
                text: `8k ultra close-up linkedin profile picture of ohwx ${gender}, professional studio setting, plain dark solid color background, wearing a tailored business suit, hyper-realistic, 8k resolution, razor-sharp focus, natural warm skin tones, high dynamic range, clean background`,
                negative_prompt: 'sad, severe, 3d, cg, cartoonish, unnatural lighting, objects, furniture, props, text, logos, busy backgrounds',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                num_images: numImagesPerPrompt,
              },
            ]
          : option == PreferenceEnum.EnvironmentalMale
          ? [
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
                callback: promptWebhookWithParams,
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.StudioFemale
          ? [
              {
                text: `8k ultra close-up linkedin profile picture of ohwx ${gender}, professional studio setting, dynamic solid color background that complements the suit, wearing a fashionable business suit, hyper-realistic, 8k resolution, razor-sharp focus, natural warm skin tones, high dynamic range, clean one color background`,
                negative_prompt: 'sad, severe, 3d, cg, cartoonish, unnatural lighting, objects, furniture, props, text, logos, busy backgrounds',
                callback: promptWebhookWithParams,
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.EnvironmentalFemale
          ? [
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
                callback: promptWebhookWithParams,
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : [
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
                callback: promptWebhookWithParams,
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ],
    },
  };

  try {
    const response = await axios.post(DOMAIN + "/tunes", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const { status, statusText, data: tune } = response;

    if (status !== 201) {
      console.error({ status });
      if (status === 400) {
        return NextResponse.json(
          {
            message: "webhookUrl must be a URL address",
          },
          { status }
        );
      }
      if (status === 402) {
        return NextResponse.json(
          {
            message: "Training models is only available on paid plans.",
          },
          { status }
        );
      }
    }

    return NextResponse.json(
      {
        message: "success",
        data: tune,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
