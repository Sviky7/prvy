import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: userId,
      },
      select: {
        post: {
          select: {
            id: true,
            imageUrl: true,
            caption: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
            likes: {
              where: {
                userId: userId,
              },
            },
            saves: {
              where: {
                userId: userId,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const transformedPosts = savedPosts.map((savedPost) => ({
      id: savedPost.post.id,
      imageUrl: savedPost.post.imageUrl,
      caption: savedPost.post.caption,
      createdAt: savedPost.post.createdAt,
      isLiked: savedPost.post.likes.length > 0,
      isSaved: savedPost.post.saves.length > 0,
      likesCount: savedPost.post._count.likes,
      commentsCount: savedPost.post._count.comments,
      user: {
        id: savedPost.post.user.id,
        name: savedPost.post.user.name || '',
        avatarUrl: savedPost.post.user.image || '',
      },
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
