"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Modal,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material"
import PrihlasenieButton from "@/components/prihlasenie/PrihlasenieButton"
import PrihlasenieDiscordButton from "@/components/prihlasenie/PrihlasenieDiscordButton"
import MuiLink from "@mui/material/Link"
import Link from "next/link"

export default function Prihlasenie() {
  const [open, setOpen] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleAlertClose = () => setShowAlert(false)

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked)
  }

  const AuthButtons = ({
    checkTerms,
    termsAccepted,
    text,
  }: {
    checkTerms?: boolean
    termsAccepted?: boolean
    text: string;
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (checkTerms && !termsAccepted) {
        e.preventDefault()
        setShowAlert(true)
        return false
      }
      return true
    }

    return (
      <>
        <Box sx={{ width: "100%" }}>
          <PrihlasenieButton text={text} onClick={handleClick} />
        </Box>
        <Box sx={{ width: "100%", marginTop: 1 }}>
          <PrihlasenieDiscordButton text={text} onClick={handleClick} />
        </Box>
      </>
    )
  }

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - 56px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Registrácia
          </Typography>
            <AuthButtons text="Registrácia" checkTerms={true} termsAccepted={termsAccepted} />
          <br/>
          <FormControlLabel
            control={<Checkbox checked={termsAccepted} onChange={handleTermsChange} />}
            label={
              <Typography variant="body2">
                Súhlasím s{" "}
                <MuiLink component={Link} href="/podmienky" sx={{ color: "text.secondary" }}>
                  obchodnými podmienkami
                </MuiLink>{" "}
                a{" "}
                <MuiLink component={Link} href="/GDPR" sx={{ color: "text.secondary" }}>
                  GDPR
                </MuiLink>
              </Typography>
            }
            sx={{ mt: 1 }}
          />
        <Box sx={{ marginTop: 4, width: "100%" }}>
          <Button
            sx={{
              width: "100%",
              textDecoration: "underline",
              backgroundColor: "none",
              "&:hover": {
                backgroundColor: "none",
                textDecoration: "underline",
              },
            }}
            onClick={handleOpen}
          >
            Už mám účet
          </Button>
        </Box>
        </Paper>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            p: { xs: 3, sm: 4 },
            position: "relative",
            outline: "none",
            border: "1px solid rgba(0,0,0,0.08)"
          }}
        >
          <Typography 
            id="modal-modal-title" 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Prihlásenie
          </Typography>

          <Box sx={{ mb: 3 }}>
            <AuthButtons text="Prihlásiť sa" checkTerms={false} termsAccepted={true} />
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              mt: 2
            }}
          >
            Prihlásením súhlasíte s{" "}
            <MuiLink 
              component={Link} 
              href="/podmienky" 
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              obchodnými podmienkami
            </MuiLink>{" "}
            a{" "}
            <MuiLink 
              component={Link} 
              href="/gdpr" 
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              GDPR
            </MuiLink>
          </Typography>
        </Box>
      </Modal>

      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity="warning" variant="filled" sx={{ width: "100%" }}>
          Musíte súhlasiť s obchodnými podmienkami a GDPR
        </Alert>
      </Snackbar>
    </Box>
  )
}