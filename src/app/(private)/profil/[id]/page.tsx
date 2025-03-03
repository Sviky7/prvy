// src/app/profil/[id]/page.tsx


import { getProfile } from "@/app/hladat/actions";
import { Avatar, Box, Container, Paper, Typography, Grid } from "@mui/material";
import Image from "next/image";

export const metadata = { title: "Detail profilu | ZoškaSnap" };

function formatDate(date: Date) {
  return date.toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default async function ProfileDetail({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getProfile(params.id);

  // Debug log
  console.log('Posts:', profile.user.posts);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            alt={profile.user.name || "Používateľ"}
            src={profile.avatarUrl || undefined}
            sx={{ width: 120, height: 120, mr: 4 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              {profile.user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile.user.email}
            </Typography>
          </Box>
        </Box>
        {profile.bio && (
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              O mne
            </Typography>
            <Typography variant="body1">{profile.bio}</Typography>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Príspevky
      </Typography>

      {profile.user.posts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Tento používateľ zatiaľ nemá žiadne príspevky
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {profile.user.posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Paper sx={{ p: 2 }}>
                <Box position="relative" width="100%" height="200px" mb={1}>
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || "Príspevok"}
                      fill
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                      sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'grey.200',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography color="text.secondary">
                        Žiadny obrázok
                      </Typography>
                    </Box>
                  )}
                </Box>
                {post.caption && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {post.caption}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  {formatDate(new Date(post.createdAt))}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}