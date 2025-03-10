import { PreferenceEnum } from "@/app/constants/preference-types";
import prisma from "@/lib/prisma";
import axios from "axios";
import { steps } from "framer-motion";
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
                text: `portrait of (ohwx ${gender}) wearing a black slim sandro professional suit jacket, editorial, professional photoshoot, grey background, pastel colors complementing attire, dior, hugo boss, armani, confidence, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'face on palm, elbow resting on table, hands by head, hand near face, wrist, hand on face, feminine, deformed, frown, angry, sad, severe, 3d, cg, objects, pins, pin, brooch, cartoonish, semi-realistic, cropped head, black and white, text, cars, logo background',
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
                text: `portrait of (ohwx ${gender}) wearing a professional black armani business suit, editorial, linkedin, model photoshoot, hugo boss, armani, brooks brothers, professional photo, bokeh background, blurred background, depth of field, glass building, office glass, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
                negative_prompt: 'hand in frame, hand raised, hand by chest, hands together, face on palm, hands by head, hand near face, wrist, hand on face, feminine, deformed, teeth, frown, angry, sad, severe, 3d, cg, objects, pins, pin, brooch, cartoonish, semi-realistic, cropped head, black and white, text, cars, logo background, obstructed view, blurry foreground',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras', 
                face_swap: 'true',
                num_images: numImagesPerPrompt,
              },
              {
                text: `portrait of (ohwx ${gender}) wearing a professional dark armani business suit, editorial, linkedin, model photoshoot, hugo boss, armani, brooks brothers, professional photo, bokeh background, blurred background, depth of field, glass building, outdoors blurred, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
                negative_prompt: 'hand in frame, hand raised, hand by chest, hands together, face on palm, hands by head, hand near face, wrist, hand on face, feminine, deformed, teeth, frown, angry, sad, severe, 3d, cg, objects, pins, pin, brooch, cartoonish, semi-realistic, cropped head, black and white, text, cars, logo background, obstructed view, blurry foreground',
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
                text: `portrait of (ohwx ${gender}) wearing a black slim sandro professional suit jacket, vera wang white blouse, official balmain editorial, model photoshoot, grey background, pastel colors complementing attire, dior, prada, chanel, elegance, Amazing Details, Best Quality, Masterpiece, dramatic lighting highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot`,
                negative_prompt: 'face on palm, elbow resting on table, hands by head, hand near face, wrist, hand on face, masculine, deformed, frown, angry, sad, cleavage, nudity, severe, 3d, cg, objects, pins, pin, brooch, cartoonish, semi-realistic, cropped head, black and white, text, cars, logo background',
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
              text: `portrait of (ohwx ${gender}) wearing a slim dark vera wang suit, official balmain editorial, beautiful, chic, elegance, linkedin, fashion photoshoot, stylish, dior, prada, chanel, blurred background, bokeh, depth of field, glass building, outdoors blurred, bokeh, Amazing Details, Best Quality, Masterpiece, dramatic lighting, highly detailed, 8k, analog photo, overglaze, 80mm Sigma f/1.4 or any ZEISS lens, wide shot, bokeh`,
              negative_prompt: 'hands by head, hand near face, masculine, deformed, frown, angry, sad, cleavage, nudity, severe, 3d, cg, objects, pins, pin, brooch, cartoonish, semi-realistic, cropped head, black and white, text, cars, logo background',
              callback: promptWebhookWithParams,
              w: 512,
              h: 640,
              scheduler: 'dpm++2m_karras', 
              face_swap: 'true',
              num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
            },
            ]
          : option == PreferenceEnum.WatercolorMale
          ? [
              {
                text: `aquarelle watercolor portrait of (ohwx ${gender}), (watercolor painting:1.2), (aquarelle:1.2), (brush strokes:1.1), (textured:1.1), (abstract:1.1), (artistic:1.2), (minimalism:1.1), (vibrant colors:1.2), (digital painting:1.1), (artstation:1.1), (smooth:1.1), (illustration:1.1), (cinematic lighting:1.1), (handsome:1.2)`,
                negative_prompt: '(photorealistic:1.2), (photo:1.2), (hyper-realistic:1.2), (detailed face:1.1), (face artifacts:1.1), (nudity:1.1), (wrinkles: 1.2)',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                steps: 50,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.WatercolorFemale
          ? [
              {
                text: `aquarelle watercolor portrait of (ohwx ${gender}), (watercolor painting:1.2), (aquarelle:1.2), (brush strokes:1.1), (textured:1.1), (abstract:1.1), (artistic:1.2), (minimalism:1.1), (vibrant colors:1.2), (digital painting:1.1), (artstation:1.1), (smooth:1.1), (illustration:1.1), (cinematic lighting:1.1), (beautiful:1.2)`,
                negative_prompt: '(photorealistic:1.2), (photo:1.2), (hyper-realistic:1.2), (detailed face:1.1), (face artifacts:1.1), (nudity:1.1), (wrinkles: 1.2)',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                steps: 50,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.CyberpunkMale
          ? [
              {
                text: `close up portrait of (ohwx ${gender}) in nightclub, cyberpunk, rim lighting, cinematic lighting, gloomy, dark, dimmed, handsome, confidence, (teal and orange:0.2), RAW photo, vignette photography, Fujifilm XT3, 8k uhd, dslr, film grain, Sci-Fi & Space Art, Dystopian & Utopian Art, cyberpunk art style, avant-garde hairstyles, futuristic clothing, glowing neon signs, traditional ink and marker`,
                negative_prompt: 'sad, scars, wrinkles, nsfw, nude, naked, 3d, Painting, cartoon, meme, ugly, obese, deformed, render, rendered, bad anatomy, bw, b&w, monochrome',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
              },
            ]
          : option == PreferenceEnum.CyberpunkFemale
          ? [
             {
                text: `close up portrait of (ohwx ${gender}) in nightclub, cyberpunk, rim lighting, cinematic lighting, gloomy, dark, dimmed, (teal and orange:0.2), RAW photo, vignette photography, Fujifilm XT3, 8k uhd, dslr, film grain, elegance, beautiful, Sci-Fi & Space Art, Dystopian & Utopian Art, cyberpunk art style, avant-garde hairstyles, futuristic clothing, glowing neon signs, traditional ink and marker`,
                negative_prompt: 'sad, scars, wrinkles, nsfw, nude, naked, 3d, Painting, cartoon, meme, ugly, obese, deformed, render, rendered, bad anatomy, bw, b&w, monochrome',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
            },
            ]
          : option == PreferenceEnum.PopartMale
          ? [
              {
                text: `portrait of isolated (ohwx ${gender}) in pop art style illustration, in the style of glamorous hollywood portraits, arr by andy warhol, mort künstler, art by roy lichtenstein, rollerwave, charming character illustrations, large format film, painted illustrations, comic book, exaggerated emotions, harmonic colors, pastel color palette, subdued color tone, halftone dots, thick black outlines, minimal details, handsome, minimalism`,
                negative_prompt: '(title:1.3), (cover headline:1.3), (flying text:1.3), (cover design:1.3), (cover text:1.3), (text:1.3), (words:1.3), (message:1.4), (pop style text:1.3), (name:1.3), text bubbles, (foreground text:1.3), initials, people, extra characters, graffiti, sign, (letters:1.2), (lipstick:1.2), numbers, (logo:1.3), (deformed iris, deformed pupils), worst quality, 3d, photorealistic, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, (extra fingers), (mutated hands), poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, (fused fingers), (too many fingers), long neck, camera, name, signature, watermark, (logo:1.1), (text art: 1.3), autograph, trademark, sticker, label, cut off, censored, bad anatomy, bad body, headphones, bad face, bad teeth, deformities, scars, freckles, (forehead wrinkles:1.2), (boring, uninteresting:1.1)',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                steps: 50,
                cfg_scale: 16,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
            },
            ]
          : option == PreferenceEnum.PopartFemale
          ? [
              {
                text: `portrait of isolated (ohwx ${gender}) in pop art style illustration, in the style of glamorous hollywood portraits, mort künstler, art by roy lichtenstein, rollerwave, charming character illustrations, large format film, painted illustrations, comic book, beautiful, elegance, bold colors, high contrast, primary colors, dynamic colors, halftone dots, thick black outlines, high contrast, minimal details, beautiful, minimalism`,
                negative_prompt: '(title:1.3), (cover headline:1.3), (cover design:1.3), (cover text:1.3), (text:1.3), (words:1.3), (message:1.4), (pop style text:1.3), (name:1.3), text bubbles, (foreground text:1.3), initials, people, extra characters, graffiti, sign, (letters:1.2), numbers, (logo:1.3), (deformed iris, deformed pupils), worst quality, 3d, photorealistic, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, (extra fingers), (mutated hands), poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, (fused fingers), (too many fingers), long neck, camera, name, signature, watermark, (logo:1.1), (text art: 1.3), autograph, trademark, sticker, label, cut off, censored, bad anatomy, bad body, headphones, bad face, bad teeth, deformities, scars, freckles, (forehead wrinkles:1.2), (boring, uninteresting:1.1)',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                steps: 50,
                cfg_scale: 16,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
            },
            ]
          : option == PreferenceEnum.GTAMale
          ? [
              {
                text: `A grand theft auto styled illustration of gangster (ohwx ${gender}) surrounded by trap house aesthetics, illustrated backdrop, bold outlines, confident, handsome, cool, digital illustration, GTA`,
                negative_prompt: ' logo, title lockup, title cover, cover, labels, letters, writing, text, title, frown, ugly, Overweight, deformed hands, weapon, signage, GTA logo, GTA logo style, (photo:1.1)',
                callback: promptWebhookWithParams,
                w: 512,
                h: 640,
                scheduler: 'dpm++2m_karras',
                face_swap: 'true',
                num_images: parseFloat(process.env.NEXT_PUBLIC_IMAGE_RESULT_COUNT ?? "8"),
            },
            ]
          : option == PreferenceEnum.GTAFemale
          ? [
              {
                text: `A grand theft auto styled illustration of gangster (ohwx ${gender}) surrounded by trap house aesthetics, illustrated backdrop, bold outlines, confident, beautiful, dangerous, cool, digital illustration, GTA`,
                negative_prompt: ' logo, title lockup, title cover, cover, labels, letters, writing, text, title, frown, ugly, Overweight, deformed hands, weapon, signage, GTA logo, GTA logo style, (photo:1.1)',
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
