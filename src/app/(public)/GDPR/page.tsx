import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export const metadata = { title: "GDPR | ZoškaSnap" };

export default function GDPRPolicy() {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center" }}>
          GDPR Zásady
        </Typography>
        <Typography variant="body1" paragraph>
          V ZoškaSnap sa zaväzujeme chrániť vaše súkromie a osobné údaje. Naše zásady GDPR zabezpečujú, že:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Zhromažďujeme iba údaje nevyhnutné pre fungovanie našej služby.</li>
          <li>Vaše osobné informácie sú spracúvané zákonne, spravodlivo a transparentne.</li>
          <li>Implementujeme vhodné technické a organizačné opatrenia na zabezpečenie bezpečnosti údajov.</li>
          <li>Máte právo kedykoľvek pristupovať k svojim osobným údajom, opraviť ich alebo vymazať.</li>
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Na našich serveroch neukladáme žiadne osobné informácie. Všetky údaje sú anonymizované a používajú sa výlučne na zlepšenie používateľskej skúsenosti.
        </Typography>
        <Typography variant="body1">
          Pre viac informácií o vašich právach podľa GDPR alebo o našich postupoch pri spracovaní údajov nás prosím kontaktujte.
        </Typography>
      </Box>
    </Container>
  );
}