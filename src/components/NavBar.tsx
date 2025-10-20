"use client";

import { useRouter } from "next/router";
import styles from "./NavBar.module.css";

const baseNavItems = [
  { label: "Profile", href: "/profile" },
  { label: "Events", href: "/events" },
  { label: "People", href: "/people" },
];

export function NavBar() {
  const router = useRouter();
  const isProfilePage = router.pathname === "/profile";

  const navItems = [
    ...baseNavItems,
    isProfilePage
      ? { label: "Edit Profile", href: "/profile/edit" }
      : { label: "New Post", href: "/posts/new" },
  ];

  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      {navItems.map((item) => {
        const isActive = item.href === router.pathname;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              void router.push(item.href);
            }}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
