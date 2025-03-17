"use client";

import { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useSession } from "next-auth/react";

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

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface PostProps {
  post: Post;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const handleLikeClick = async () => {
    if (!session?.user?.id) return;

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
    if (!newComment.trim() || !session?.user?.id) return;

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
        setComments(prev => [comment, ...prev]); 
        setNewComment("");
        setCommentsCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        setCommentsCount(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSaveClick = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/save`, {
        method: isSaved ? "DELETE" : "POST",
      });

      if (response.ok || (response.status === 400 && !isSaved)) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
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
    <Card sx={{ maxWidth: "100%", borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Avatar
          alt={post.user.name || "Používateľ"}
          src={post.user.avatarUrl || undefined}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="subtitle1" fontWeight="bold">
          {post.user.name || "Používateľ"}
        </Typography>
      </Box>
      <CardMedia
        component="img"
        image={post.imageUrl}
        alt={post.caption || "Obrázok"}
        sx={{ 
          width: "100%",
          height: "auto",
          maxHeight: "500px",
          objectFit: "cover",
          backgroundColor: "#f5f5f5"
        }}
      />
      <CardActions sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton 
            onClick={handleLikeClick}
            sx={{ color: isLiked ? "error.main" : undefined }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </Typography>
          <IconButton onClick={loadComments}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">
            {commentsCount} {commentsCount === 1 ? "komentár" : "komentáre"}
          </Typography>
        </Box>
        <IconButton 
          onClick={handleSaveClick}
          sx={{ color: isSaved ? "primary.main" : undefined }}
        >
          {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
      <CardContent sx={{ pt: 0 }}>
        {post.caption && (
          <Typography variant="body1" sx={{ mb: 1 }}>
            <Box component="span" fontWeight="bold" mr={1}>
              {post.user.name || "Používateľ"}
            </Box>
            {post.caption}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          {formatDate(post.createdAt)}
        </Typography>
        {showComments && (
          <>
            <Divider sx={{ my: 2 }} />
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
                sx={{ float: 'right' }}
              >
                Pridať
              </Button>
            </Box>
            <Box sx={{ mt: 4, clear: 'both' }}>
              {isLoading ? (
                <Typography>Načítavam komentáre...</Typography>
              ) : (
                comments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={comment.user.image || undefined}
                        alt={comment.user.name || "Používateľ"}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" component="span">
                          {comment.user.name || "Používateľ"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      {session?.user?.id === comment.userId && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteComment(comment.id)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ ml: 5 }}>
                      {comment.content}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;