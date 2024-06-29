import { PreferenceEnum } from "@/app/constants/preference-types";
import prisma from "@/lib/prisma";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";


const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";
// For local development, recommend using an Ngrok tunnel for the domain

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


  // const name = payload.name;
  // const shot = "Close-Up: Focuses closely on the face, capturing fine details and expressions.";
  // const background = "Solid Color: Simple, distraction-free background in a single color.";
  // const light = "Natural: Soft, natural light that mimics daylight, creating a realistic and pleasant effect.";
  // const clothing = "Business Formal: Outfits such as suits and ties, blazers, and formal dresses.";
  // const expression = "Smiling: Adjusts facial features to create a warm, approachable smile.";
  // const colorPalette = "Warm: Uses warm tones such as reds, oranges, and yellows to create a cozy and inviting atmosphere.";



  const newimageGeneration = await prisma.imageGeneration.create({
    data: {
      gid: id,
      blobUrls: images,
      status: "pending",
      count: 4
    },
  });

  if (!astriaApiKey) {
    return NextResponse.json(
      {
        message:
          "Missing API Key: Add your Astria API Key to generate headshots",
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

  // try {
    const trainWebhook = `https://${process.env.DEPLOYMENT_URL}/astria/train-webhook`;
    const trainWebhookWithParams = `${trainWebhook}?user_id=${id}&webhook_secret=${appWebhookSecret}`;

    const promptWebhook = `https://${process.env.DEPLOYMENT_URL}/astria/prompt-webhook`;
    const promptWebhookWithParams = `${promptWebhook}?user_id=${id}&webhook_secret=${appWebhookSecret}`;

    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    const body = {
      tune: {
        title: "test",
        // Hard coded tune id of Realistic Vision v5.1 from the gallery - https://www.astria.ai/gallery/tunes
        // https://www.astria.ai/gallery/tunes/690204/prompts
        base_tune_id: 690204,
        name: gender,
        branch: astriaTestModeIsOn ? "fast" : "sd15",
        token: "ohwx",
        image_urls: images,
        callback: trainWebhookWithParams,
        prompts_attributes:
          option == PreferenceEnum.StudioMale ?
          [{
            text: `portrait of ohwx ${gender} wearing a business suit, professional photo, white background, color background, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, analog photo, overglaze, realistic facial features, natural skin texture, 80mm Sigma f/1.4 or any ZEISS lens`,
            callback: promptWebhookWithParams,
            num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? '1'),
          }] : option == PreferenceEnum.EnvironmentalMale ?
          [{
            text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
            callback: promptWebhookWithParams,
            num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? '1'),
          }] : option == PreferenceEnum.StudioFemale ? 
          [{
            text: `portrait of ohwx ${gender} wearing a business suit, professional photo, white background, color background, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, analog photo, overglaze, realistic facial features, natural skin texture, 80mm Sigma f/1.4 or any ZEISS lens`,
            callback: promptWebhookWithParams,
            num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? '1'),
          }] : [
            {
              text: `8k close-up linkedin profile picture of ohwx ${gender}, professional business attire, professional headshots, photo-realistic, 4k, high-resolution image, workplace setting, upper body, modern outfit, professional suit, business, blurred background, glass building, office window, high detail, realistic skin texture, soft lighting`,
              callback: promptWebhookWithParams,
              num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? '1'),
            }
          ]
        
      },
    };

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
      { status: 200 },
    );
  // } catch (e) {
  //   console.error(e);
  //   return NextResponse.json(
  //     {
  //       message: "Something went wrong!",
  //     },
  //     { status: 500 }
  //   );
  // }

  // return NextResponse.json(
  //   {
  //     message: "success",
  //   },
  //   { status: 200 }
  // );
}
