// src/app/profil/[id]/page.tsx
import { getProfile, getSavedPosts } from "@/app/hladat/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Container, Paper, Typography } from "@mui/material";
import ProfileContent from './ProfileContent';

export const metadata = { title: "Detail profilu | ZoškaSnap" };

interface Profile {
    id: string;
    userId: string;
    bio: string | null;
    avatarUrl: string | null;
    location: string | null;
    interests: string[];
    user: {
        id: string;
        name: string | null;
        email: string;
        isFollowing: boolean;
        followersCount: number;
        followingCount: number;
        posts: {
            id: string;
            imageUrl: string;
            caption: string | null;
            createdAt: Date;
            likes: { id: string }[];
            saves: { id: string }[];
            _count: {
                likes: number;
                comments: number;
            };
            author: {
                id: string;
                name: string | null;
                image: string | null;
            };
        }[];
    };
}

export default async function ProfileDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { view?: string };
}) {
  try {
    const profile = await getProfile(params.id) as Profile;
    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.id === params.id;
    const view = searchParams?.view;

    // If view is 'saved', we'll pass the saved posts data
    const savedPosts = view === 'saved' ? await getSavedPosts() : undefined;

    return <ProfileContent 
      profile={profile} 
      isOwnProfile={isOwnProfile} 
      savedPosts={savedPosts}
    />;
  } catch (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Profil sa nepodarilo načítať
          </Typography>
          <Typography color="text.secondary">
            Skúste to prosím neskôr alebo kontaktujte podporu.
          </Typography>
        </Paper>
      </Container>
    );
  }
}