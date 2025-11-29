import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EventIcon from "@mui/icons-material/Event";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  value?: string;
};

export function NavBar() {
  const { user } = useAuthContext();
  const [currentNavMenu, setCurrentNavMenu] = useState(0);

  const authUserId = user?.id ?? null;
  const profileHref = authUserId ? `/profile/${authUserId}` : "/profile";

  const navItems: NavItem[] = [
    {
      label: "Profile",
      href: profileHref,
      icon: <AccountCircleIcon />,
      value: "/profile",
    },
    { label: "Events", href: "/events", icon: <EventIcon /> },
    { label: "People", href: "/people", icon: <PeopleAltIcon /> },
    { label: "New Event", href: "/events/new", icon: <AddBoxIcon /> },
  ];

  return (
    <Paper
      component="nav"
      elevation={3}
      square
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      aria-label="Primary navigation"
    >
      <Box sx={{ position: "relative" }}>
        <BottomNavigation
          value={currentNavMenu}
          onChange={(_event, newNavMenu) => setCurrentNavMenu(newNavMenu)}
          showLabels
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.href}
              component={Link}
              href={item.href}
              icon={item.icon}
              value={item.value ?? item.href}
              sx={{
                textTransform: "uppercase",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            />
          ))}
        </BottomNavigation>
        <Box
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            display: { xs: "none", sm: "block" },
          }}
        >
          <ThemeToggle />
        </Box>
      </Box>
    </Paper>
  );
}
