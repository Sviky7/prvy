'use client';

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

interface Post {
  id: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
  };
}

export default function PostCard({ post, currentUserId }: { post: Post; currentUserId: string }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const loadComments = async () => {
    if (!showComments) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setIsLoading(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [...prev, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('sk-SK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card sx={{ mb: 4, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            src={post.user.image || undefined}
            alt={post.user.name || "User"}
          />
        }
        title={post.user.name || "Používateľ"}
        subheader={formatDate(post.createdAt)}
      />
      <CardMedia
        component="img"
        image={post.imageUrl}
        alt={post.caption || "Post image"}
        sx={{ width: "100%", maxHeight: 600, objectFit: "contain" }}
      />
      <CardActions disableSpacing>
        <IconButton 
          onClick={handleLikeClick}
          sx={{ color: isLiked ? "error.main" : undefined }}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </Typography>
        <IconButton onClick={loadComments}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {post.commentsCount} {post.commentsCount === 1 ? "komentár" : "komentáre"}
        </Typography>
      </CardActions>
      {post.caption && (
        <CardContent>
          <Typography variant="body2" color="text.primary">
            {post.caption}
          </Typography>
        </CardContent>
      )}
      {showComments && (
        <CardContent>
          {isLoading ? (
            <Typography>Načítavam komentáre...</Typography>
          ) : (
            <>
              <Box component="form" onSubmit={handleAddComment} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Pridať komentár..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={!newComment.trim()}
                  size="small"
                >
                  Pridať
                </Button>
              </Box>
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 1,
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">
                    <strong>{comment.user.name || "Používateľ"}</strong>{" "}
                    {comment.content}
                  </Typography>
                  {comment.user.id === currentUserId && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(comment.id)}
                      sx={{ ml: "auto" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
