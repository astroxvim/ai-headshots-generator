import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
	const id = await request.json();

	try {
		const user = await prisma.imageGeneration.findUnique({
			where: { gid: id },
		});

		const trained_image = await prisma.images.findMany({
			where: { gid: id },
			select: { blob: true }
		});

		console.log(trained_image);

		return NextResponse.json(
			{
				trained_image,
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
