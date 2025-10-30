import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
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
  const router = useRouter();
<<<<<<< HEAD
  const pathname = router.pathname;
  const isProfileSection = pathname.startsWith("/profile");
  const authUserId = user?.id ?? null;
  const profileHref = authUserId ? `/profile/${authUserId}` : "/profile";
  const profileRouteId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : ((router.query.id as string | undefined) ?? null);
  const isProfileEditPage = pathname === "/profile/edit";
  const viewingOwnProfile =
    Boolean(authUserId) &&
    (pathname === "/profile" ||
      isProfileEditPage ||
      (pathname === "/profile/[id]" && profileRouteId === authUserId));

  const baseNavItems: NavItem[] = [
    {
      label: "Profile",
      href: profileHref,
      icon: <AccountCircleIcon />,
      value: "/profile",
    },
    { label: "Events", href: "/events", icon: <EventIcon /> },
    { label: "People", href: "/people", icon: <PeopleAltIcon /> },
  ];

  const navItems = [
    ...baseNavItems,
    isProfileSection && viewingOwnProfile
      ? {
          label: "Edit Profile",
          href: "/profile/edit",
          icon: <EditIcon />,
          value: "/profile/edit",
        }
      : { label: "New Event", href: "/events/new", icon: <AddBoxIcon /> },
=======
  const isProfileSection =
    router.pathname === "/profile" || router.pathname === "/profile/edit";

  const navItems = [
    ...baseNavItems,
    isProfileSection
      ? {
          label: "Edit Profile",
          href: "/profile/EditProfile",
          icon: <EditIcon />,
        }
      : { label: "New Post", href: "/posts/new", icon: <AddBoxIcon /> },
>>>>>>> 0a57299 (Fix and center Edit Profile layout)
  ];

  const activeNavValue = isProfileEditPage
    ? "/profile/edit"
    : isProfileSection
      ? "/profile"
      : pathname;

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
        <BottomNavigation value={activeNavValue} showLabels>
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
