"use client";

import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutModal from "./LogoutModal";
import { IconButton } from "@mui/material";

import Avatar from "@mui/material/Avatar";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useEffect } from "react";

export default function NavBar() {
  const [value, setValue] = React.useState("Domov");
  const { data: session } = useSession();
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const { toggleTheme, isDarkMode } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(!logoutModalOpen);
  };

  const navItems = [
    { label: "Domov", value: "Domov", icon: <HomeIcon />, href: "/" },
    ...(session
      ? [
          {
            label: "Hladat",
            value: "Hladat",
            icon: <SearchIcon />,
            onClick: () => {
              // Implement search functionality
            },
          },
          {
            label: "Pridat",
            value: "Prispevok",
            icon: <PostAddIcon />,
            href: "/prispevok/novy",
          },
          {
            label: "Profil",
            value: "/profil",
            href: "/profil",
            icon: session?.user?.image ? (
              <Avatar
                alt={session?.user?.name || "User"}
                src={session?.user?.image || undefined}/>
              ) : (
                <Avatar>{session?.user?.name?.charAt(0) || "U"}</Avatar>
              ),  


            
          },
          {
            label: "Odhlasenie",
            value: "Odhlasenie",
            icon: <LogoutIcon />,
            onClick: handleLogoutClick,
          },
        ]
      : [
          {
            label: "O nas",
            value: "O nas",
            icon: <PersonIcon />,
            href: "/o-nas",
          },    
          {
            label: "Profil",
            value: "Profil",
            icon: <PersonIcon />,
            href: "/profil",
          }  ,  
          {
            label: "Prihlasenie",
            value: "Prihlasenie",
            icon: <LoginIcon />,
            href: "/auth/prihlasenie",
          },
        ]),
  ];

  return (
    <>
      <BottomNavigation
        sx={{
          maxWidth: "100%",
          width: 1000,
          margin: "0 auto",
          justifyContent: "center",
        }}
        value={value}
        onChange={handleChange}
        showLabels
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
            component={item.href ? Link : "button"}
            href={item.href || undefined}
            onClick={item.onClick}
            showLabel
          />
        ))}
        <IconButton
          onClick={toggleTheme}
          sx={{ color: (theme) => theme.palette.text.primary, ml: 2 }}
        >
          {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </BottomNavigation>
      <LogoutModal open={logoutModalOpen} onClose={handleLogoutClick} />
    </>
  );
}