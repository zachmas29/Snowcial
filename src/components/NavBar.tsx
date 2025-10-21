import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { useRouter } from "next/router";

const baseNavItems = [
  { label: "Profile", href: "/profile" },
  { label: "Events", href: "/events" },
  { label: "People", href: "/people" },
];

export function NavBar() {
  const router = useRouter();
  const isProfileSection = router.pathname.startsWith("/profile");

  const navItems = [
    ...baseNavItems,
    isProfileSection
      ? { label: "Edit Profile", href: "/profile/edit" }
      : { label: "New Post", href: "/posts/new" },
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
      <BottomNavigation value={router.pathname} showLabels>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.href}
            component={Link}
            href={item.href}
            label={item.label}
            value={item.href}
            sx={{
              textTransform: "uppercase",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
