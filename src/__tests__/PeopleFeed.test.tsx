/* biome-ignore-all lint/style/useNamingConvention: <Using snake_case to match Supabase database schema> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import PeopleFeed from "@/components/PeopleFeed";
import type { UserWithTags } from "@/types/User";

const mockUsers: UserWithTags[] = [
  {
    id: "1",
    first_name: "Sophie",
    last_name: "Martinez",
    email: "smartinez@middlebury.edu",
    bio_text: "Snowboarder who loves park features",
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
  },
  {
    id: "2",
    first_name: "Jake",
    last_name: "Thompson",
    email: "jthompson@middlebury.edu",
    bio_text: "Alpine skier, all-mountain enthusiast",
    created_at: "2025-02-01T00:00:00+00:00",
    last_updated: "2025-02-01T00:00:00+00:00",
    banner_photo_path: null,
    profile_photo_path: null,
    nick_name: "jakerides",
    last_active: "2025-11-13T00:00:00+00:00",
    tags: [{ id: 3, name: "Sugarbush" }],
  },
  {
    id: "3",
    first_name: "Maya",
    last_name: "Patel",
    email: "mpatel@middlebury.edu",
    bio_text: null,
    created_at: "2025-03-01T00:00:00+00:00",
    last_updated: "2025-03-01T00:00:00+00:00",
    banner_photo_path: null,
    profile_photo_path: null,
    nick_name: null,
    last_active: "2025-11-13T00:00:00+00:00",
    tags: [],
  },
];

describe("PeopleFeed", () => {
  test("Smoke test - renders without crashing", () => {
    render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    const { asFragment } = render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("Displays all users initially", () => {
    render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
    expect(screen.getByText("Jake Thompson")).toBeInTheDocument();
    expect(screen.getByText("Maya Patel")).toBeInTheDocument();
  });

  test("Displays empty message when no users provided", () => {
    render(<PeopleFeed users={[]} searchTerm="" sortType="alphabetical" />);
    expect(screen.getByText("No people found.")).toBeInTheDocument();
  });

  test("Displays custom empty message", () => {
    render(
      <PeopleFeed
        users={[]}
        emptyMessage="No members found"
        searchTerm=""
        sortType="alphabetical"
      />,
    );
    expect(screen.getByText("No members found")).toBeInTheDocument();
  });

  test("Filters users by search term", () => {
    render(
      <PeopleFeed
        users={mockUsers}
        searchTerm="Sophie"
        sortType="alphabetical"
      />,
    );
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
    expect(screen.queryByText("Jake Thompson")).not.toBeInTheDocument();
    expect(screen.queryByText("Maya Patel")).not.toBeInTheDocument();
  });

  test("Filters users by last name", () => {
    render(
      <PeopleFeed
        users={mockUsers}
        searchTerm="Thompson"
        sortType="alphabetical"
      />,
    );
    expect(screen.getByText("Jake Thompson")).toBeInTheDocument();
    expect(screen.queryByText("Sophie Martinez")).not.toBeInTheDocument();
  });

  test("Search is case insensitive", () => {
    render(
      <PeopleFeed
        users={mockUsers}
        searchTerm="sophie"
        sortType="alphabetical"
      />,
    );
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
  });

  test("Shows empty message when search returns no results", () => {
    render(
      <PeopleFeed
        users={mockUsers}
        searchTerm="NonExistent"
        sortType="alphabetical"
      />,
    );
    expect(screen.getByText("No people found.")).toBeInTheDocument();
  });

  test("Sorts users alphabetically", () => {
    render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    // Verify all users are rendered in alphabetical order
    const allElements = screen.getAllByText(/Martinez|Thompson|Patel/);
    expect(allElements[0]?.textContent).toContain("Jake Thompson");
  });

  test("Sorts users by newest", () => {
    render(<PeopleFeed users={mockUsers} searchTerm="" sortType="newest" />);
    // Newest sort should show Maya (created 2025-03-01) first
    const allElements = screen.getAllByText(/Martinez|Thompson|Patel/);
    expect(allElements[0]?.textContent).toContain("Maya Patel");
  });

  test("Sorts users by oldest", () => {
    render(<PeopleFeed users={mockUsers} searchTerm="" sortType="oldest" />);
    // Oldest sort should show Sophie (created 2025-01-01) first
    const allElements = screen.getAllByText(/Martinez|Thompson|Patel/);
    expect(allElements[0]?.textContent).toContain("Sophie Martinez");
  });

  test("Displays user bio text when available", () => {
    render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    expect(
      screen.getByText("Snowboarder who loves park features"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Alpine skier, all-mountain enthusiast"),
    ).toBeInTheDocument();
  });

  test("Combines search and sort correctly", () => {
    const { container } = render(
      <PeopleFeed users={mockUsers} searchTerm="o" sortType="alphabetical" />,
    );
    // Should match "Sophie", "Thompson" (contains 'o')
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
    expect(screen.getByText("Jake Thompson")).toBeInTheDocument();
    expect(screen.queryByText("Maya Patel")).not.toBeInTheDocument();
  });

  test("Respects maxWidth prop", () => {
    const { container } = render(
      <PeopleFeed
        users={mockUsers}
        searchTerm=""
        sortType="alphabetical"
        maxWidth={800}
      />,
    );
    const feedBox = container.firstChild as HTMLElement;
    expect(feedBox).toHaveStyle({ maxWidth: "800px" });
  });

  test("Respects spacing prop", () => {
    render(
      <PeopleFeed
        users={mockUsers}
        searchTerm=""
        sortType="alphabetical"
        spacing={4}
      />,
    );
    // Spacing affects grid gap
    expect(screen.getByText("Sophie Martinez")).toBeInTheDocument();
  });

  test("Displays nicknames with @ prefix when available", () => {
    render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    expect(screen.getByText("@sophieshreds")).toBeInTheDocument();
    expect(screen.getByText("@jakerides")).toBeInTheDocument();
  });

  test("Handles users without nicknames", () => {
    render(
      <PeopleFeed users={mockUsers} searchTerm="" sortType="alphabetical" />,
    );
    // Maya Patel has no nickname, should still render
    expect(screen.getByText("Maya Patel")).toBeInTheDocument();
    expect(screen.queryByText("@maya")).not.toBeInTheDocument();
  });
});
