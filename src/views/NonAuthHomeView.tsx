"use client";

import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

import logo from "@/public/_images/logoBig.png";
import whiteLogo from "@/public/_images/whiteLogo.png";

import Prihlasenie from "@/app/auth/prihlasenie/page";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container maxWidth="lg" disableGutters>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            justifyContent: "center",
            alignItems: isMobile ? undefined : "center",
            p: 2,
          }}
        >
          <Image
            priority
            alt="logo"
            style={{
              position: isMobile ? "absolute" : undefined,
            }}
            src={theme.palette.mode === "dark" ? logo : whiteLogo}
            width={isMobile ? 100 : 500}
            height={isMobile ? 100 : 500}
          />
        </Box>
        <Box
          sx={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Prihlasenie />
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;