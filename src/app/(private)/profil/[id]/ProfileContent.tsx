'use client';

import { Avatar, Box, Container, Paper, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PostCard from '@/app/(private)/prispevok/_components/PostCard';
import { useSession } from "next-auth/react";

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

interface ProfileContentProps {
  profile: Profile;
  isOwnProfile: boolean;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function EditProfileButton({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.user.name || '',
    bio: profile.bio || '',
    location: profile.location || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  return (
    <>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleOpen}
        >
          Upraviť profil
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upraviť profil</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Meno"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="dense"
              name="bio"
              label="O mne"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              name="location"
              label="Odkiaľ som"
              type="text"
              fullWidth
              value={formData.location}
              onChange={handleChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Zrušiť</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ukladá sa...' : 'Uložiť'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

function FollowButton({ profile, isFollowing }: { profile: Profile; isFollowing: boolean }) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/follow', {
        method: following ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: profile.user.id }),
      });

      if (!response.ok) throw new Error('Failed to toggle follow');

      setFollowing(!following);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? "outlined" : "contained"}
      color="primary"
      startIcon={following ? <PersonRemoveIcon /> : <PersonAddIcon />}
      onClick={handleFollowToggle}
      disabled={loading}
      sx={{ ml: 2 }}
    >
      {following ? 'Nesledovať' : 'Sledovať'}
    </Button>
  );
}

export default function ProfileContent({ profile, isOwnProfile }: ProfileContentProps) {
  const { data: session } = useSession();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4, position: 'relative' }}>
        {isOwnProfile && <EditProfileButton profile={profile} />}
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            alt={profile.user.name || "Používateľ"}
            src={profile.avatarUrl || undefined}
            sx={{ width: 120, height: 120, mr: 4 }}
          />
          <Box>
            <Box display="flex" alignItems="center">
              <Typography variant="h4" gutterBottom>
                {profile.user.name}
              </Typography>
              {!isOwnProfile && (
                <FollowButton profile={profile} isFollowing={profile.user.isFollowing} />
              )}
            </Box>
            <Typography variant="body1" color="text.secondary">
              {profile.user.email}
            </Typography>
            <Box display="flex" gap={2} mt={1}>
              <Typography variant="body2" color="text.secondary">
                <strong>{profile.user.followersCount}</strong> sledovateľov
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>{profile.user.followingCount}</strong> sledovaných
              </Typography>
            </Box>
            {profile.location && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <LocationOnIcon fontSize="small" />
                {profile.location}
              </Typography>
            )}
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

      <Grid container spacing={2}>
        {profile.user.posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <PostCard 
              post={{
                ...post,
                user: {
                  id: profile.user.id,
                  name: profile.user.name || '',
                  avatarUrl: profile.avatarUrl || ''
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
