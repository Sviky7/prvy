"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import debounce from "lodash/debounce";
import { Container, List, TextField, Typography } from "@mui/material";
import ProfileListSkeleton from "./components/ProfileSkeletonLoader";
import SearchCard from "./components/SearchCard";

interface Profile {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  avatarUrl: string | null | undefined;
  bio: string | null | undefined;
  location: string | null | undefined;
}

export default function OptimizedInstagramStyleSearch() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async (value: string) => {
    try {
      const response = await fetch(`/api/profile/search?query=${encodeURIComponent(value)}`);
      if (!response.ok) {
        throw new Error("Nastala chyba pri vyhľadávaní");
      }
      const results = await response.json();
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError("Nastala chyba pri vyhľadávaní");
      setSearchResults([]);
    }
  };

  // Load all profiles initially
  useEffect(() => {
    startTransition(() => {
      fetchProfiles("");
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      startTransition(() => {
        fetchProfiles(value);
      });
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Hľadať
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Názov používateľa"
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />
      {isPending ? (
        <ProfileListSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : searchResults.length === 0 ? (
        <Typography>Žiadne výsledky</Typography>
      ) : (
        <List sx={{ width: "100%" }}>
          {searchResults.map((profile) => (
            <SearchCard key={profile.id} profile={profile} />
          ))}
        </List>
      )}
    </Container>
  );
}