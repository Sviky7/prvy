// src/app/o-nas/page.tsx

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export const metadata = { title: "O nás | ZoškaSnap" };

export default function AboutUs() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          O nás - ZoškaSnap
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Vitajte v aplikácii ZoškaSnap!
        </Typography>
        <Typography paragraph>
          ZoškaSnap je inovatívna platforma vytvorená špeciálne pre študentov a učiteľov. Naším cieľom je uľahčiť zdieľanie poznámok, podporiť spoluprácu a zlepšiť vzdelávací proces.
        </Typography>
        <Typography paragraph>
          S ZoškaSnap môžete jednoducho:
        </Typography>
        <Typography component="ul">
          <li>Zdieľať svoje poznámky a učebné materiály</li>
          <li>Spolupracovať na projektoch v reálnom čase</li>
          <li>Diskutovať o učebných témach s ostatnými študentmi</li>
          <li>Organizovať svoje študijné materiály efektívnejšie</li>
        </Typography>
        <Typography paragraph>
          Veríme, že vzdelávanie by malo byť dostupné a interaktívne. ZoškaSnap je naším príspevkom k modernému a efektívnemu vzdelávaniu.
        </Typography>
      </Box>
    </Container>
  );
}