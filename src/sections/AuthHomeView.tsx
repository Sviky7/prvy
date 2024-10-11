// src/sections/AuthHomeView.tsx

import { Container, Typography, Box } from "@mui/material";
import { Session } from "next-auth";

export default function AuthHomeView({ session }: { session: Session }) {

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Vitajte, {session?.user?.name || "užívateľ"}!
      </Typography>

      {/* Use Box or div instead of Typography for pre-formatted text */}
      <Box sx={{ mt: 2 }}>
        <pre>{JSON.stringify(session, null, 2)}</pre> {/* Formats and displays the session data */}
      </Box>
    </Container>
  );
}



