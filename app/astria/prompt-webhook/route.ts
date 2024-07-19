import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

if (!appWebhookSecret) {
  throw new Error("MISSING APP_WEBHOOK_SECRET!");
}

export async function POST(request: Request) {
  type PromptData = {
    id: number;
    text: string;
    negative_prompt: string;
    steps: null;
    tune_id: string;
    trained_at: string;
    face_swap: string;
    scheduler: string;
    started_training_at: string;
    created_at: string;
    updated_at: string;
    images: string[];
  };

  const incomingData = (await request.json()) as { prompt: PromptData };

  const { prompt } = incomingData;

  console.log({ prompt });

  const urlObj = new URL(request.url);
  const user_id = urlObj.searchParams.get("user_id");
  const webhook_secret = urlObj.searchParams.get("webhook_secret");

  if (!webhook_secret) {
    return NextResponse.json(
      {
        message: "Malformed URL, no webhook_secret detected!",
      },
      { status: 500 }
    );
  }

  console.log(webhook_secret);

  if (webhook_secret.toLowerCase() !== appWebhookSecret?.toLowerCase()) {
    return NextResponse.json(
      {
        message: "Unauthorized!",
      },
      { status: 401 }
    );
  }

  console.log(user_id);

  if (!user_id) {
    return NextResponse.json(
      {
        message: "Malformed URL, no user_id detected!",
      },
      { status: 500 }
    );
  }

  try {
    // Here we join all of the arrays into one.
    const allHeadshots = prompt.images;
    const modelId = prompt.tune_id;

    await Promise.all(
      allHeadshots.map(async (image) => {
        const newUser = await prisma.images.create({
          data: {
            gid: user_id,
            blob: image
          },
        });
        if (prisma && prisma.imageGeneration) {
          const re = await prisma.imageGeneration.findUnique({
            where: { gid: user_id },
          });

          const updatedUser = await prisma.imageGeneration.update({
            where: { gid: user_id }, // Use parseInt to convert string to number
            data: {
              count: (re?.count ?? 1) - 1
            },
          });
        }
      })
    );

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200, statusText: "Success" }
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
