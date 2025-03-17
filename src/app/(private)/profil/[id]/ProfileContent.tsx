'use client';

import { Avatar, Box, Container, Paper, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PostCard from '@/app/(private)/prispevok/_components/PostCard';

type PostWithCounts = {
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
};

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
    posts: PostWithCounts[];
  };
}

interface ProfileContentProps {
  profile: Profile;
  isOwnProfile: boolean;
}

type Post = {
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

export default function ProfileContent({ profile, isOwnProfile, savedPosts }: ProfileContentProps & { savedPosts?: Post[] }) {
  const postsToDisplay = savedPosts ? savedPosts : profile.user.posts.map((post: PostWithCounts) => ({
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    createdAt: post.createdAt,
    isLiked: post.likes.length > 0,
    isSaved: post.saves.length > 0,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    user: {
      id: post.author.id,
      name: post.author.name || '',
      avatarUrl: post.author.image || '',
    }
  }));

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, position: 'relative' }}>
        {isOwnProfile && <EditProfileButton profile={profile} />}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={profile.avatarUrl || undefined}
            alt={profile.user.name || 'Profile'}
            sx={{ width: 120, height: 120, mr: 3 }}
          />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" component="h1">
                {profile.user.name || 'Používateľ'}
              </Typography>
              {!isOwnProfile && (
                <FollowButton profile={profile} isFollowing={profile.user.isFollowing} />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <Typography>
                <strong>{profile.user.posts.length}</strong> príspevkov
              </Typography>
              <Typography>
                <strong>{profile.user.followersCount}</strong> sledovateľov
              </Typography>
              <Typography>
                <strong>{profile.user.followingCount}</strong> sledovaných
              </Typography>
            </Box>
            {profile.bio && (
              <Typography sx={{ mt: 2 }}>{profile.bio}</Typography>
            )}
            {profile.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{profile.location}</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          {postsToDisplay.length > 0 ? (
            postsToDisplay.map((post) => (
              <Grid item xs={12} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center" sx={{ py: 4 }}>
                Zatiaľ nemáte žiadne uložené príspevky.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
