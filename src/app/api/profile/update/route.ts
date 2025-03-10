import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio, location, name } = await request.json();
    console.log('Received update data:', { bio, location, name });

    // Update user name
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { name: true }
    });

    // Update or create profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    console.log('Existing profile:', existingProfile);

    const updatedProfile = await prisma.profile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        bio: bio ?? existingProfile?.bio,
        location: location ?? existingProfile?.location,
      },
      create: {
        userId: session.user.id,
        bio: bio ?? null,
        location: location ?? null,
      },
    });

    console.log('Updated profile:', updatedProfile);

    return NextResponse.json({
      ...updatedProfile,
      user: {
        name: updatedUser.name
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
