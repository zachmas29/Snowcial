import { KeyboardBackspace } from "@mui/icons-material";
import { Box, Button, Container, type ContainerProps } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: ContainerProps["maxWidth"];
  sx?: ContainerProps["sx"];
}

/**
 * PageLayout component provides consistent page width and spacing
 * across all pages using MUI Container
 */

export default function PageLayout({
  children,
  maxWidth = "md",
  sx,
}: PageLayoutProps) {
  const router = useRouter();

  const showBackButton = () => {
    const pathname = router.pathname;
    return pathname === "/profile/[id]" || pathname === "/events/[id]";
  };

  const getBackHref = () => {
    const pathname = router.pathname;
    if (pathname === "/profile/[id]") return "/people";
    if (pathname === "/events/[id]") return "/events";
    return "/";
  };

  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: { xs: 2, sm: 4 },
        ...sx,
      }}
    >
      {showBackButton() && (
        <NextLink href={getBackHref()} passHref legacyBehavior>
          <Button color="primary" component="a">
            <KeyboardBackspace />
            BACK
          </Button>
        </NextLink>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
