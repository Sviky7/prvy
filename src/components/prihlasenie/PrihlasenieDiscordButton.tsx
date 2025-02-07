// src/components/prihlasenie/PrihlasenieDiscordButton.tsx
"use client";
import { signIn } from "next-auth/react";
import { Button } from "@mui/material";
import DiscordIcon from "@/components/prihlasenie/DiscordIcon";

export default function PrihlasenieDiscordButton({ 
   
  onClick 
}: { 
  text?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const handleDiscordSignIn = (e: React.MouseEvent) => {
    onClick?.(e);
    signIn("discord", { callbackUrl: "/" });
  };

  return (
    <Button
      fullWidth
      variant="contained"
      startIcon={<DiscordIcon />}
      onClick={handleDiscordSignIn}
      sx={{
        marginTop: 3,
        backgroundColor: "#852eff",
        color: "#fff",
        "&:hover": { backgroundColor: "#6a1ed4" },
        borderRadius: 2,
        padding: "10px 20px",
        textTransform: "none",
      }}
    >
       Registrovať sa cez Discord
    </Button>
  );
}