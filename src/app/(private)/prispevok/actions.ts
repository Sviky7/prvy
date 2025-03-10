'use server';

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function getPosts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      imageUrl: true,
      caption: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      },
      likes: {
        where: {
          userId: session.user.id
        },
        take: 1,
        select: {
          id: true
        }
      }
    }
  });

  return posts.map(post => ({
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    createdAt: post.createdAt,
    user: post.user,
    _count: {
      likes: post._count.likes,
      comments: post._count.comments
    },
    isLiked: post.likes.length > 0
  }));
}