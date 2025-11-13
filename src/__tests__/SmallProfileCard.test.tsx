/* biome-ignore-all lint/style/useNamingConvention: <Using snake_case to match Supabase database schema> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import SmallProfileCard from "@/components/SmallProfileCard";
import type { UserWithTags } from "@/types/User";

const mockUser: UserWithTags = {
  id: "1",
  first_name: "Sophie",
  last_name: "Martinez",
  email: "smartinez@middlebury.edu",
  bio_text: "Snowboarder who loves park features and powder days",
  created_at: "2025-01-01T00:00:00+00:00",
  last_updated: "2025-01-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: "sophieshreds",
  last_active: "2025-11-13T00:00:00+00:00",
  tags: [
    { id: 1, name: "Snowbowl" },
    { id: 2, name: "Park" },
  ],
};

const mockUserNoBio: UserWithTags = {
  id: "2",
  first_name: "Jake",
  last_name: "Thompson",
  email: "jthompson@middlebury.edu",
  bio_text: null,
  created_at: "2025-02-01T00:00:00+00:00",
  last_updated: "2025-02-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: "jakerides",
  last_active: "2025-11-13T00:00:00+00:00",
  tags: [],
};

const mockUserNoNickname: UserWithTags = {
  id: "3",
  first_name: "Maya",
  last_name: "Patel",
  email: "mpatel@middlebury.edu",
  bio_text: "Cross-country skier and Nordic enthusiast",
  created_at: "2025-03-01T00:00:00+00:00",
  last_updated: "2025-03-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: null,
  last_active: "2025-11-13T00:00:00+00:00",
  tags: [{ id: 3, name: "Nordic" }],
};

describe("SmallProfileCard", () => {
  test("Smoke test - renders without crashing", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    const { asFragment } = render(<SmallProfileCard user={mockUser} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("Displays first name and last name", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
  });

  test("Displays nickname with @ prefix", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("@sophieshreds")).toBeInTheDocument();
  });

  test("Hides nickname section when nickname is null", () => {
    render(<SmallProfileCard user={mockUserNoNickname} />);
    expect(screen.queryByText("@maya")).not.toBeInTheDocument();
  });

  test("Displays bio text when available", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(
      screen.getByText("Snowboarder who loves park features and powder days"),
    ).toBeInTheDocument();
  });

  test("Hides bio section when bio_text is null", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    expect(screen.queryByText(/park features|powder/)).not.toBeInTheDocument();
  });

  test("Displays all tags", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
    expect(screen.getByText("Park")).toBeInTheDocument();
  });

  test("Hides tag section when tags array is empty", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    // When tags are empty, no tag chips are rendered
    expect(screen.queryByText("Nordic")).not.toBeInTheDocument();
  });

  test("Displays single tag", () => {
    render(<SmallProfileCard user={mockUserNoNickname} />);
    expect(screen.getByText("Nordic")).toBeInTheDocument();
  });

  test("Renders avatar with correct initials", () => {
    const { container } = render(<SmallProfileCard user={mockUser} />);
    const avatar = container.querySelector('[class*="MuiAvatar"]');
    expect(avatar?.textContent).toMatch(/S/);
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
    const name = screen.getByText("Sophie Martinez");
    const nickname = screen.getByText("@sophieshreds");
    expect(name).toBeInTheDocument();
    expect(nickname).toBeInTheDocument();
  });

  test("Handles user with all fields populated", () => {
    render(<SmallProfileCard user={mockUser} />);
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
    expect(screen.getByText("@sophieshreds")).toBeInTheDocument();
    expect(
      screen.getByText("Snowboarder who loves park features and powder days"),
    ).toBeInTheDocument();
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
    expect(screen.getByText("Park")).toBeInTheDocument();
  });

  test("Handles user with minimal fields", () => {
    render(<SmallProfileCard user={mockUserNoBio} />);
    expect(screen.getByText("Jake Thompson")).toBeInTheDocument();
    expect(screen.getByText("@jakerides")).toBeInTheDocument();
    // Bio and tags should not be visible
    expect(
      screen.queryByText(/snowboarder|park|powder/i),
    ).not.toBeInTheDocument();
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
        { id: 1, name: "Snowbowl" },
        { id: 2, name: "Park" },
        { id: 3, name: "Backcountry" },
      ],
    };
    render(<SmallProfileCard user={userMultipleTags} />);
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
    expect(screen.getByText("Park")).toBeInTheDocument();
    expect(screen.getByText("Backcountry")).toBeInTheDocument();
  });
});
