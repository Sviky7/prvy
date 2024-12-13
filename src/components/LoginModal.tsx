"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useTheme } from "@mui/material/styles";
import { Google as GoogleIcon } from "@mui/icons-material";
import DiscordIcon from "./prihlasenie/DiscordIcon";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LogoutModal({ open, onClose }: LogoutModalProps) {
  const theme = useTheme();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleDiscordSignIn = () => {
    signIn("discord", { callbackUrl: "/" });
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          [theme.breakpoints.up("sm")]: {
            borderRadius: 4,
            padding: theme.spacing(3),
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            maxWidth: 400,
            backgroundColor: theme.palette.background.default,
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, textAlign: "center" }}>
        Prihlásenie
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon/>}
            sx={{
            marginTop: 3,
            backgroundColor: "#4285F4",
            color: "#fff",
            "&:hover": { backgroundColor: "#357ae8" },
            borderRadius: 2,
            padding: "10px 20px",
            textTransform: "none",
              
            }}
          >
            Registrovať sa cez Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleDiscordSignIn}
            startIcon={
                <DiscordIcon/>
            }
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
            Registovať sa cez Discord
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: theme.spacing(2, 3),
        }}
      >
        <Button
          onClick={onClose}
          sx={{ color: theme.palette.error.main, fontWeight: 500 }}
        >
          Zrušiť
        </Button>
      </DialogActions>  
    </Dialog>
  );
}

