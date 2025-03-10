import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Skeleton,
  Grid,
} from "@mui/material";

const PostCardLoader: React.FC = () => {
  return (
    <Card sx={{ maxWidth: "100%", borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Skeleton variant="text" width={120} />
      </Box>
      <Skeleton 
        variant="rectangular" 
        height={400}
        sx={{ 
          width: "100%",
          backgroundColor: "#f5f5f5"
        }}
      />
      <CardActions sx={{ px: 2, py: 1 }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={40} sx={{ mr: 2 }} />
        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={60} />
      </CardActions>
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Skeleton variant="text" width={100} sx={{ mr: 1 }} />
          <Skeleton variant="text" width="60%" />
        </Box>
        <Skeleton variant="text" width={120} />
      </CardContent>
    </Card>
  );
};

const LoadingPosts = () => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Grid item xs={12} key={index}>
          <PostCardLoader />
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingPosts;