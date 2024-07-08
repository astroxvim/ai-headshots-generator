import { PreferenceEnum } from "@/app/constants/preference-types";
import prisma from "@/lib/prisma";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";
const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

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
      title: "UPIC Headshots",
      base_tune_id: 1176603,
      name: gender,
      branch: astriaTestModeIsOn ? "fast" : "sd15",
      token: "ohwx",
      image_urls: images,
      callback: trainWebhookWithParams,
      prompts_attributes:
        option == PreferenceEnum.StudioMale
          ? [
              {
                text: `portrait of ${gender} wearing a business suit, model photoshoot, professional photo, white background, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'frown, angry, sad, severe, 3d, cg, cartoonish, semi-realistic, cropped head',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                face_swap: 'true',
                scheduler: 'dpm++2m_karras', 
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.EnvironmentalMale
          ? [
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshot, photo-realistic, 4k resolution, workplace setting, upper body, modern outfit, varied professional suits (different colors and styles), business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
                negative_prompt: 'sad, severe, 3d, cg, cartoonish, green',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                num_images: numImagesPerPrompt,
              },
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshot, photo-realistic, 4k resolution, city environment, upper body, modern outfit, varied professional suits different colors and styles, business, blurred background, buildings, cityscape, trees, high detail, realistic skin texture, soft lighting`,
                negative_prompt: 'sad, severe, 3d, cg, cartoonish',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                num_images: numImagesPerPrompt,
              },
            ]
          : option == PreferenceEnum.StudioFemale
          ? [
              {
                text: `portrait of ${gender} wearing a business suit, model photoshoot, professional photo, white background, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'frown, angry, sad, cleavage, nudity, severe, 3d, cg, cartoonish, semi-realistic, cropped head',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                face_swap: 'true',
                scheduler: 'dpm++2m_karras', 
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.EnvironmentalFemale
          ? [
            {
              text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshot, photo-realistic, 4k resolution, workplace setting, upper body, modern outfit, varied professional suits different colors and styles, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
              negative_prompt: 'cleavage, sad, severe, 3d, cg, cartoonish, green',
              callback: promptWebhookWithParams,
              w: 512,
              h: 640,
              num_images: numImagesPerPrompt,
            },
            {
              text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshot, photo-realistic, 4k resolution, city environment, upper body, modern outfit, varied professional suits (different colors and styles), business, blurred background, blurred trees, buildings, cityscape, high detail, realistic skin texture, soft lighting`,
              negative_prompt: 'cleavage, sad, severe, 3d, cg, cartoonish',
              callback: promptWebhookWithParams,
              w: 512,
              h: 640,
              num_images: numImagesPerPrompt,
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
