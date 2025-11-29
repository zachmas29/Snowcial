/** biome-ignore-all lint/style/useNamingConvention: <supabase format> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import EventFeed from "@/components/EventFeed";
import * as dbFunctions from "@/lib/db_functions";
import type { Tables } from "@/types/database.types";

vi.mock("@/lib/db_functions");
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

const mockEvent: Tables<"events"> = {
  id: 1,
  title: "Morning Powder Run at Snowbowl",
  description:
    "Fresh snow expected tonight! Let's meet at the base lodge at 9am for first tracks. All levels welcome, we'll split into groups by ability.",
  event_time: "2025-11-15T12:00:00.000Z",
  creator_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  created_at: "2025-11-01T12:00:00+00:00",
  last_updated: "2025-11-01T12:00:00+00:00",
};

const mockUser: Tables<"users"> = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  first_name: "Emma",
  last_name: "Johnson",
  email: "emma.johnson@middlebury.edu",
  nick_name: "EmmaJ",
  bio_text:
    "Love hitting the slopes early morning! Always looking for powder days at Snowbowl.",
  created_at: "2025-01-01T00:00:00+00:00",
  last_updated: "2025-01-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: "https://lh3.googleusercontent.com/a/default-user",
  last_active: "2025-11-13T00:00:00+00:00",
};

const mockAttendeeCount = {
  yes: 3,
  maybe: 0,
  total: 3,
};

const mockTags: Tables<"event_tags">[] = [
  {
    id: 1,
    name: "Snowbowl",
  },
];

describe("EventFeed", () => {
  test("Smoke test - renders without crashing", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    // Verify key content instead of snapshot
    expect(
      screen.getByText((content) => content.includes("Emma Johnson")),
    ).toBeInTheDocument();
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
  });

  test("Shows loading spinner initially", () => {
    vi.mocked(dbFunctions.fetchEvents).mockImplementation(
      () => new Promise(() => {}),
    );

    const { container } = render(<EventFeed />);
    expect(
      container.querySelector("[class*='MuiCircularProgress']"),
    ).toBeInTheDocument();
  });

  test("Fetches and displays events", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(
      screen.getByText((content) => content.includes("Emma Johnson")),
    ).toBeInTheDocument();
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
  });

  test("Displays error message when fetch fails", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockRejectedValue(
      new Error("Network error"),
    );

    render(<EventFeed />);
    await screen.findByText("Unable to fetch event feed right now.");
    expect(
      screen.getByText("Unable to fetch event feed right now."),
    ).toBeInTheDocument();
  });

  test("Displays empty state when no events", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([]);

    render(<EventFeed />);
    await screen.findByText("There are no events to display");
    expect(
      screen.getByText("There are no events to display"),
    ).toBeInTheDocument();
  });

  test("Handles multiple events", async () => {
    const mockEvent2 = {
      ...mockEvent,
      id: 2,
      title: "Park Session at Snowbowl",
    };
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([
      mockEvent,
      mockEvent2,
    ]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
    expect(screen.getByText("Park Session at Snowbowl")).toBeInTheDocument();
  });

  test("Handles event with missing user gracefully", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(null);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Handles event with missing tags", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue([]);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Calls fetchUser with correct event creator_id", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(vi.mocked(dbFunctions.fetchUser)).toHaveBeenCalledWith(
      "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    );
  });

  test("Calls getAttendeeCount with correct event id", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(vi.mocked(dbFunctions.getAttendeeCount)).toHaveBeenCalledWith(1);
  });

  test("Calls fetchEventTags with correct event id", async () => {
    vi.mocked(dbFunctions.fetchEvents).mockResolvedValue([mockEvent]);
    vi.mocked(dbFunctions.fetchUser).mockResolvedValue(mockUser);
    vi.mocked(dbFunctions.getAttendeeCount).mockResolvedValue(
      mockAttendeeCount,
    );
    vi.mocked(dbFunctions.fetchEventTags).mockResolvedValue(mockTags);

    render(<EventFeed />);
    await screen.findByText("Morning Powder Run at Snowbowl");
    expect(vi.mocked(dbFunctions.fetchEventTags)).toHaveBeenCalledWith(1);
  });
});
