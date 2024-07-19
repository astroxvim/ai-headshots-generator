import { PreferenceEnum } from "@/app/constants/preference-types2";
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
      base_tune_id: 1176604,
      name: gender,
      branch: astriaTestModeIsOn ? "fast" : "sd15",
      token: "ohwx",
      image_urls: images,
      callback: trainWebhookWithParams,
      prompts_attributes:
        option == PreferenceEnum.WatercolorMale || option == PreferenceEnum.WatercolorFemale
          ? [
              {
                text: `Artistic portrait of (ohwx ${gender}) watercolor art, watercolor painting, aquarelle, fantasy, ultra detailed, color, watercolor painting, illustration, vibrant colors, symmetrical highly detailed, digital painting, arstation, concept art, smooth, sharp focus, illustration, cinematic lighting art by Artgerm and Greg Turkowski and Alphonse Mucha`,
                negative_prompt: 'freckles, face artifacts',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.CyberpunkMale || option == PreferenceEnum.CyberpunkFemale
          ? [
              {
                text: `(ohwx ${gender}) in nightclub, cyberpunk, rim lighting, cinematic lighting, gloomy, dark, dimmed, (teal and orange:0.2), RAW photo, vignette photography, Fujifilm XT3, 8k uhd, dslr, film grain`,
                negative_prompt: 'nsfw, nude, naked, 3d, Painting, cartoon, meme, ugly, obese, deformed, render, rendered, bad anatomy, bw, b&w, monochrome',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.SuperheroMale || option == PreferenceEnum.SuperheroFemale
          ? [
              {
                text: `(ohwx ${gender}) (best-quality:0.8), (best-quality:0.8), perfect illustration, beautiful, elegant, superhero, hero costume, dynamic, electric, powerful, particulate, rich colors, intricate, elegant, highly detailed, harpers bazaar art, smooth, sharp focus, 8k, octane rende`,
                negative_prompt: 'clay, text, watermark, padding, cropped, typography, extra fingers, mutated hands, poorly drawn hands, ((poorly drawn face,)) deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime, nude, NSFW',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : [
              {
                text: `portrait of (ohwx ${gender}) wearing a business suit, model photoshoot, professional photo, dynamic solid color background, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'frown, angry, sad, severe, 3d, cg, cartoonish, hands, objects, pins, semi-realistic, cropped head',
                callback: promptWebhookWithParams,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
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
