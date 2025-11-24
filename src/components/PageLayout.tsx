import { Box, Container, type ContainerProps } from "@mui/material";
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
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        py: { xs: 2, sm: 4 },
        ...sx,
      }}
    >
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
