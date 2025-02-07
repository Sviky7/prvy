// src/app/podmienky/page.tsx

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export const metadata = { title: "Podmienky používania | ZoškaSnap" };

export default function TermsConditions() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center" }}>
          Podmienky používania ZoškaSnap
        </Typography>
        <Typography variant="body1" paragraph>
          Vitajte na ZoškaSnap. Používaním našej služby súhlasíte s nasledujúcimi podmienkami:
        </Typography>
        <Typography component="ol" sx={{ pl: 4 }}>
          <li>Služba je určená pre študentov a učiteľov na zdieľanie vzdelávacích materiálov.</li>
          <li>Používatelia sú zodpovední za obsah, ktorý zdieľajú, a musia rešpektovať autorské práva.</li>
          <li>Zakazuje sa zdieľanie nevhodného, urážlivého alebo nelegálneho obsahu.</li>
          <li>ZoškaSnap nenesie zodpovednosť za presnosť alebo úplnosť zdieľaných informácií.</li>
          <li>Vyhradzujeme si právo odstrániť akýkoľvek obsah alebo zrušiť účet, ktorý porušuje tieto podmienky.</li>
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Vaše súkromie je pre nás dôležité. Nezhromažďujeme ani neukladáme žiadne osobné údaje. Všetky interakcie sú anonymné a dáta nie sú uložené na našich serveroch.
        </Typography>
        <Typography variant="body1">
          Používaním ZoškaSnap potvrdzujete, že ste si prečítali, porozumeli a súhlasíte s týmito podmienkami používania.
        </Typography>
      </Box>
    </Container>
  );
}