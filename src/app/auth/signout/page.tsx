'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper,
  CircularProgress
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      router.push('/') // Redirect to home page after sign out
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Sign Out
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Are you sure you want to sign out?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
            onClick={handleSignOut}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}