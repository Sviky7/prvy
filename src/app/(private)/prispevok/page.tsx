import { Container, Grid, Typography } from "@mui/material";
import PostCard from "./_components/PostCard";
import EmptyPosts from "./_components/EmptyPosts";
import { Suspense } from "react";
import LoadingPosts from "./_components/PostCardLoader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
}

export default function Prispevky() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Príspevky
      </Typography>
      <Suspense fallback={<LoadingPosts />}>
        <PostsList />
      </Suspense>
    </Container>
  );
}

async function PostsList() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <Typography color="error" textAlign="center">
        Pre zobrazenie príspevkov sa musíte prihlásiť
      </Typography>
    );
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile: {
            select: {
              avatarUrl: true
            }
          }
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

  const transformedPosts: Post[] = posts.map(post => ({
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    createdAt: post.createdAt,
    isLiked: post.likes.length > 0,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    user: {
      id: post.user.id,
      name: post.user.name || '',
      avatarUrl: post.user.profile?.avatarUrl || ''
    }
  }));

  if (!transformedPosts.length) {
    return <EmptyPosts />;
  }

  return (
    <Grid container spacing={3}>
      {transformedPosts.map((post) => (
        <Grid item xs={12} key={post.id}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
}