'use client'

import { signIn } from 'next-auth/react'
import { Google as GoogleIcon } from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Link as MuiLink
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import DiscordIcon from './prihlasenie/DiscordIcon'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    backgroundColor: theme.palette.background.default,
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  padding: '10px 20px',
  textTransform: 'none',
}))

const GoogleButton = styled(StyledButton)({
  backgroundColor: '#4285F4',
  color: '#fff',
  '&:hover': { backgroundColor: '#357ae8' },
})

const DiscordButton = styled(StyledButton)({
  backgroundColor: '#852eff',
  color: '#fff',
  '&:hover': { backgroundColor: '#6a1ed4' },
})

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' })
  }

  const handleDiscordSignIn = async () => {
    await signIn('discord', { callbackUrl: '/' })
  }

  return (
    <StyledDialog fullWidth open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
        Prihlasenie
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <GoogleButton
            fullWidth
            variant="contained"
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon />}
          >
            Prihlasenie sa cez Google
          </GoogleButton>
          <DiscordButton
            fullWidth
            variant="contained"
            onClick={handleDiscordSignIn}
            startIcon={<DiscordIcon />}
          >
            Prihlasenie sa cez Discord
          </DiscordButton>
        </Stack>
      </DialogContent>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          textAlign: 'center',
          mt: 2,
          color: 'text.secondary',
        }}
      >
        Prihlásením súhlasite s{' '}
        <Link href="/podmienky" passHref>
          <MuiLink sx={{ color: 'text.secondary' }}>
            obchodnými podmienkami
          </MuiLink>
        </Link>{' '}
        a{' '}
        <Link href="\GDPR" passHref>
          <MuiLink sx={{ color: 'text.secondary' }}>GDPR</MuiLink>
        </Link>
      </Typography>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Button onClick={onClose} sx={{ color: 'error.main', fontWeight: 500 }}>
          Zrušiť
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}
