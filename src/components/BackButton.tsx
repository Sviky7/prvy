'use client';

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button 
      variant="outlined" 
      onClick={() => router.back()}
      sx={{ mb: 2 }}
    >
      Späť
    </Button>
  );
}
