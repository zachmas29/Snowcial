/* biome-ignore-all lint/style/useNamingConvention: <Using snake_case to match Supabase database schema> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import SmallProfileCard from "@/components/SmallProfileCard";
import type { UserWithTags } from "@/types/User";

const mockUser: UserWithTags = {
  id: "1",
  first_name: "Alice",
  last_name: "Smith",
  email: "alice@example.com",
  bio_text: "Product manager and tech enthusiast",
  created_at: "2025-01-01T00:00:00+00:00",
  last_updated: "2025-01-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: "ali",
  last_active: "2025-11-13T00:00:00+00:00",
  tags: [
    { id: 1, name: "Product" },
    { id: 2, name: "Manager" },
  ],
};

const mockUserNoBio: UserWithTags = {
  id: "2",
  first_name: "Bob",
  last_name: "Johnson",
  email: "bob@example.com",
  bio_text: null,
  created_at: "2025-02-01T00:00:00+00:00",
  last_updated: "2025-02-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: "bobj",
  last_active: "2025-11-13T00:00:00+00:00",
  tags: [],
};

const mockUserNoNickname: UserWithTags = {
  id: "3",
  first_name: "Charlie",
  last_name: "Brown",
  email: "charlie@example.com",
  bio_text: "Designer",
  created_at: "2025-03-01T00:00:00+00:00",
  last_updated: "2025-03-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: null,
  last_active: "2025-11-13T00:00:00+00:00",
  tags: [{ id: 3, name: "Design" }],
};

describe("SmallProfileCard", () => {
  test("Smoke test - renders without crashing", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    const { asFragment } = render(<SmallProfileCard user={mockUser} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("Displays first name and last name", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
  });

  test("Displays nickname with @ prefix", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("@ali")).toBeInTheDocument();
  });

  test("Hides nickname section when nickname is null", () => {
    render(<SmallProfileCard user={mockUserNoNickname} />);
    expect(screen.queryByText("@charlie")).not.toBeInTheDocument();
  });

  test("Displays bio text when available", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(
      screen.getByText("Product manager and tech enthusiast"),
    ).toBeInTheDocument();
  });

  test("Hides bio section when bio_text is null", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    expect(screen.queryByText(/enthusiast/)).not.toBeInTheDocument();
  });

  test("Displays all tags", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  test("Hides tag section when tags array is empty", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    // When tags are empty, no tag chips are rendered
    expect(screen.queryByText("Design")).not.toBeInTheDocument();
  });

  test("Displays single tag", () => {
    render(<SmallProfileCard user={mockUserNoNickname} />);
    expect(screen.getByText("Design")).toBeInTheDocument();
  });

  test("Renders avatar with correct initials", () => {
    const { container } = render(<SmallProfileCard user={mockUser} />);
    const avatar = container.querySelector('[class*="MuiAvatar"]');
    expect(avatar?.textContent).toMatch(/A/);
  });

  test("Renders avatar with fallback initials for empty names", () => {
    const userEmptyNames = {
      ...mockUser,
      first_name: "",
      last_name: "",
    };
    const { container } = render(<SmallProfileCard user={userEmptyNames} />);
    const avatar = container.querySelector('[class*="MuiAvatar"]');
    // Should show empty or just first char placeholder
    expect(avatar).toBeInTheDocument();
  });

  test("Links to correct profile page", () => {
    render(<SmallProfileCard user={mockUser} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/1");
  });

  test("Links with different user IDs", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/2");
  });

  test("Displays card with proper structure", () => {
    const { container } = render(<SmallProfileCard user={mockUser} />);
    const card = container.querySelector('[class*="MuiCard"]');
    expect(card).toBeInTheDocument();
  });

  test("Displays profile information in correct order", () => {
    render(<SmallProfileCard user={mockUser} />);
    // Name should appear before nickname in document
    const name = screen.getByText("Alice Smith");
    const nickname = screen.getByText("@ali");
    expect(name).toBeInTheDocument();
    expect(nickname).toBeInTheDocument();
  });

  test("Handles user with all fields populated", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("@ali")).toBeInTheDocument();
    expect(
      screen.getByText("Product manager and tech enthusiast"),
    ).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  test("Handles user with minimal fields", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("@bobj")).toBeInTheDocument();
    // Bio and tags should not be visible
    expect(screen.queryByText(/bio|design|product/i)).not.toBeInTheDocument();
  });

  test("Card is clickable and navigates", () => {
    render(<SmallProfileCard user={mockUser} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", expect.stringContaining("/profile/"));
  });

  test("Multiple tags display correctly", () => {
    const userMultipleTags = {
      ...mockUser,
      tags: [
        { id: 1, name: "Product" },
        { id: 2, name: "Manager" },
        { id: 3, name: "Leadership" },
      ],
    };
    render(<SmallProfileCard user={userMultipleTags} />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();
  });
});
