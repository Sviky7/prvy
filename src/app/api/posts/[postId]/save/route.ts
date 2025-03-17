import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const save = await prisma.$transaction(async (tx) => {
      // Check if post exists
      const post = await tx.post.findUnique({
        where: { id: params.postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      // Create save record
      return await tx.savedPost.create({
        data: {
          userId: userId,
          postId: params.postId,
        },
      });
    });

    return NextResponse.json(save);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Post already saved" },
        { status: 400 }
      );
    }
    console.error("Error saving post:", error);
    return NextResponse.json(
      { error: "Failed to save post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      // Check if post exists
      const post = await tx.post.findUnique({
        where: { id: params.postId },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      // Delete save record
      await tx.savedPost.deleteMany({
        where: {
          userId: userId,
          postId: params.postId,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving post:", error);
    return NextResponse.json(
      { error: "Failed to unsave post" },
      { status: 500 }
    );
  }
}
