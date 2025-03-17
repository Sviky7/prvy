"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import PostCard from "@/app/(private)/prispevok/_components/PostCard";
import { useSession } from "next-auth/react";

type ExtendedPost = {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  isLiked: boolean;
  isSaved: boolean;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
};

export default function SavedPosts() {
  const { data: session } = useSession();
  const [savedPosts, setSavedPosts] = useState<ExtendedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/posts/saved`);
        if (response.ok) {
          const posts = await response.json();
          setSavedPosts(posts);
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Načítavam uložené príspevky...</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Pre zobrazenie uložených príspevkov sa musíte prihlásiť.</Typography>
      </Container>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Zatiaľ nemáte žiadne uložené príspevky.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Uložené príspevky
      </Typography>
      <Grid container spacing={2}>
        {savedPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <PostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
