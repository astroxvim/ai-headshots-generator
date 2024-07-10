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
                text: `portrait of (ohwx ${gender}) wearing a business suit, model photoshoot, professional photo, dynamic solid color background, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'frown, angry, sad, severe, 3d, cg, cartoonish, hand, props, finger, pin, semi-realistic, cropped head',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras', 
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.EnvironmentalMale
          ? [
              {
                text: `portrait of (ohwx ${gender}) wearing a professional business suit, linkedin, model photoshoot, hugo boss, armani, brooks brothers, professional photo, blurred background, bokeh, depth of field, glass building, office window, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
                negative_prompt: 'frown, angry, sad, severe, 3d, cg, cartoonish, hand, finger, props, pin, brooch, semi-realistic, extreme closeup, cropped head, people, full body, text',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras', 
                face_swap: 'true',
                num_images: numImagesPerPrompt,
              },
              {
                text: `portrait of (ohwx ${gender}) wearing a professional business suit, linkedin, model photoshoot, hugo boss, armani, brooks brothers, professional photo, blurred background, bokeh, depth of field, glass building, outdoors blurred, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
                negative_prompt: 'frown, angry, sad, severe, 3d, cg, cartoonish, hand, finger, props, pin, brooch, semi-realistic, extreme closeup, cropped head, people, full body, text',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras', 
                face_swap: 'true',
                num_images: numImagesPerPrompt,
              },
            ]
          : option == PreferenceEnum.StudioFemale
          ? [
              {
                text: `portrait of (ohwx ${gender}) wearing a business suit, model photoshoot, professional photo, dynamic solid color background complementing attire, dior, prada, chanel, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'frown, angry, sad, cleavage, nudity, severe, 3d, cg, hands, objects, pins, cartoonish, semi-realistic, cropped head, black and white',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras', 
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.EnvironmentalFemale
          ? [
            {
              text: `portrait of (ohwx ${gender}) wearing a professional business suit, linkedin, model photoshoot, stylish blouse, dior, prada, chanel, professional photo, blurred background, bokeh, depth of field, glass building, office window, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
              negative_prompt: 'cleavage, nudity, frown, angry, sad, severe, 3d, cg, cartoonish, hand, finger, props, pin, brooch, semi-realistic, extreme closeup, cropped head, people, full body, text',
              callback: promptWebhookWithParams,
              w: 512,
              h: 640,
              scheduler: 'dpm++2m_karras', 
              face_swap: 'true',
              num_images: numImagesPerPrompt,
            },
            {
              text: `portrait of (ohwx ${gender}) wearing a professional business suit, linkedin, model photoshoot, stylish blouse, dior, prada, chanel, professional photo, blurred background, bokeh, depth of field, glass building, outdoors blurred, bokeh, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
              negative_prompt: 'cleavage, nudity, frown, angry, sad, severe, 3d, cg, cartoonish, hand, finger, props, pin, brooch, semi-realistic, extreme closeup, cropped head, people, full body, text',
              callback: promptWebhookWithParams,
              w: 512,
              h: 640,
              scheduler: 'dpm++2m_karras', 
              face_swap: 'true',
              num_images: numImagesPerPrompt,
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
