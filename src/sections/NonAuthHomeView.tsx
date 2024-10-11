// src/sections/NonAuthHomeView.tsx

import { Container, Typography } from "@mui/material";

export default function NonAuthHomeView() {
  return (
    <Container>
      <Typography variant="h4">Vitajte na ZoškaSnap</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Prihláste sa pre plný prístup alebo vytvorte nový účet, aby ste mohli pridať príspevky a zobraziť profil.
      </Typography>
    </Container>
  );
}

