"use client";

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";

interface Profile {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  avatarUrl: string | null | undefined;
  bio: string | null | undefined;
  location: string | null | undefined;
}

export default function SearchCard({ profile }: { profile: Profile }) {
  return (
    <ListItem
      component={Link}
      href={`/profil/${profile.user.id}`}
      sx={{
        borderRadius: 2,
        mb: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar src={profile.avatarUrl || undefined} alt={profile.user.name || "User"} />
      </ListItemAvatar>
      <ListItemText
        primary={profile.user.name || "Používateľ"}
        secondary={
          <>
            {profile.bio && (
              <Typography
                component="span"
                variant="body2"
                color="text.primary"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile.bio}
              </Typography>
            )}
            {profile.location && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {profile.location}
              </Typography>
            )}
          </>
        }
      />
    </ListItem>
  );
}