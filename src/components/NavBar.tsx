"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./NavBar.module.css";

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
    <nav className={styles.nav} aria-label="Primary navigation">
      {navItems.map((item) => {
        const isActive = item.href === router.pathname;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
