import { PreferenceEnum } from "@/app/constants/preference-types";
import prisma from "@/lib/prisma";
import axios from "axios";
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

  const newImageGeneration = await prisma.imageGeneration.create({
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
      { status: 500 }
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
        option === PreferenceEnum.StudioMale
          ? [
              {
                text: `portrait of ohwx ${gender} wearing a business suit, professional photo, white background, color background, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, analog photo, overglaze, realistic facial features, natural skin texture, 80mm Sigma f/1.4 or any ZEISS lens`,
                callback: promptWebhookWithParams,
                num_images: 4,
              },
              {
                text: `8k close up linkedin profile picture of handsome ohwx ${gender}, buttoned black shirt, warm skin tones colors --tiled_upscale`,
                callback: promptWebhookWithParams,
                num_images: 4,
              },
            ]
          : option === PreferenceEnum.EnvironmentalMale
          ? [
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
                callback: promptWebhookWithParams,
                num_images: 8,
              },
            ]
          : option === PreferenceEnum.StudioFemale
          ? [
              {
                text: `portrait of ohwx ${gender} wearing a business suit, professional photo, white background, color background, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, analog photo, overglaze, realistic facial features, natural skin texture, 80mm Sigma f/1.4 or any ZEISS lens`,
                callback: promptWebhookWithParams,
                num_images: 8,
              },
            ]
          : [
              {
                text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
                callback: promptWebhookWithParams,
                num_images: 8,
              },
            ],
    },
  };

  // Debugging log to ensure the structure is correct
  console.log("Request Body:", JSON.stringify(body, null, 2));

  try {
    const response = await axios.post(DOMAIN + "/tunes", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const { status, data: tune } = response;

    if (status !== 201) {
      console.error({ status });
      return NextResponse.json(
        {
          message: "Unexpected response status",
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        message: "success",
        data: tune,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Axios Error:", e);
    if (e.response) {
      console.error("Response Data:", e.response.data);
      console.error("Response Status:", e.response.status);
      console.error("Response Headers:", e.response.headers);
    }
    return NextResponse.json(
      {
        message: "Something went wrong!",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
