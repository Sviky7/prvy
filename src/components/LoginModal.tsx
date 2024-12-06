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
              py: 1.5,
              borderColor: "divider",
              color: "text.primary",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
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
              py: 1.5,
              borderColor: "#5865F2",
              color: "#5865F2",
              "&:hover": {
                borderColor: "#5865F2",
                backgroundColor: "rgba(88, 101, 242, 0.08)",
              },
            }}
          >
            Registrovať sa cez Discord
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

