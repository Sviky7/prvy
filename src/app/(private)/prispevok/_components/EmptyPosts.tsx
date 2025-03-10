import { Box, Typography, Paper } from "@mui/material";

export default function EmptyPosts() {
  return (
    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Zatiaľ tu nie sú žiadne príspevky
      </Typography>
      <Typography color="text.secondary">
        Pridajte nový príspevok alebo sledujte ďalších používateľov.
      </Typography>
    </Paper>
  );
}