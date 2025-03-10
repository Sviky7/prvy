// src/app/profil/[id]/page.tsx
import { getProfile } from "@/app/hladat/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Container, Paper, Typography } from "@mui/material";
import ProfileContent from './ProfileContent';

export const metadata = { title: "Detail profilu | ZoškaSnap" };

interface Profile {
  user: {
    id: string;
    name: string | null;
    email: string;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    posts: {
      id: string;
      createdAt: Date;
      imageUrl: string;
      caption: string | null;
      isLiked: boolean;
      likesCount: number;
      commentsCount: number;
    }[];
  };
  id: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
}

export default async function ProfileDetail({
  params,
}: {
  params: { id: string };
}) {
  try {
    const profile = await getProfile(params.id) as Profile;
    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.id === params.id;

    return <ProfileContent profile={profile} isOwnProfile={isOwnProfile} />;
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