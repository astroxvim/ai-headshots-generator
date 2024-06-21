import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Replace with your actual image URL
  const imageUrl = await request.json();

  const response = await fetch(imageUrl);
  const imageBlob = await response.blob();

  return new Response(imageBlob, {
    headers: {
      'Content-Type': 'image/jpeg', // Set appropriate content type
      'Content-Disposition': 'attachment; filename="1.jpg"' // Optional: Set filename for download
    },
  });
}