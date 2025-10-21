import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import FaceIcon from "@mui/icons-material/Face";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { useRouter } from "next/router";

const baseNavItems = [
  { label: "Profile", href: "/profile", icon: <FaceIcon /> },
  { label: "Events", href: "/events", icon: <EventIcon /> },
  { label: "People", href: "/people", icon: <PeopleAltIcon /> },
];

export function NavBar() {
  const router = useRouter();
  const isProfileSection = router.pathname.startsWith("/profile");

  const navItems = [
    ...baseNavItems,
    isProfileSection
      ? { label: "Edit Profile", href: "/profile/edit", icon: <EditIcon /> }
      : { label: "New Post", href: "/posts/new", icon: <AddBoxIcon /> },
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
            icon={item.icon}
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
