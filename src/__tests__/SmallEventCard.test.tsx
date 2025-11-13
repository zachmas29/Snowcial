/** biome-ignore-all lint/style/useNamingConvention: <using supabase styling conventions> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import SmallEventCard from "@/components/SmallEventCard";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { Tables } from "@/types/database.types";

const mockEvent: Tables<"events"> = {
  id: 1,
  title: "Morning Powder Run at Snowbowl",
  description:
    "Fresh snow expected tonight! Let's meet at the base lodge at 9am for first tracks. All levels welcome, we'll split into groups by ability.",
  event_time: "2025-11-15T09:00:00-05:00",
  creator_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  created_at: "2025-11-01T12:00:00+00:00",
  last_updated: "2025-11-01T12:00:00+00:00",
};

const mockUser: Tables<"users"> = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  first_name: "Emma",
  last_name: "Johnson",
  email: "emma@example.com",
  bio_text: "Ski instructor and mountain enthusiast",
  created_at: "2025-01-01T00:00:00+00:00",
  last_updated: "2025-01-01T00:00:00+00:00",
  banner_photo_path: null,
  profile_photo_path: null,
  nick_name: "emmaj",
  last_active: "2025-11-13T00:00:00+00:00",
};

const mockEventTags: Tables<"event_tags">[] = [
  {
    id: 1,
    name: "Snowbowl",
  },
];

const mockAttendingCount: AttendeeCountType = {
  yes: 15,
  maybe: 5,
  total: 22,
};

describe("SmallEventCard", () => {
  test("Smoke test - renders without crashing", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={false}
      />,
    );
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    const { asFragment } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={false}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("Renders event title from props", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Renders event description from props", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(
      screen.getByText(
        "Fresh snow expected tonight! Let's meet at the base lodge at 9am for first tracks. All levels welcome, we'll split into groups by ability.",
      ),
    ).toBeInTheDocument();
  });

  test("Displays user name in subheader", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(
      screen.getByText((content) => content.includes("Emma Johnson")),
    ).toBeInTheDocument();
  });

  test("Displays event time in subheader", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(screen.getByText(/2025-11-15T09:00:00/)).toBeInTheDocument();
  });

  test("Renders all event tags", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
  });

  test("Displays attendee count correctly when yes !== total", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(screen.getByText("15-22 people attending")).toBeInTheDocument();
  });

  test("Displays attendee count correctly when all confirmed (yes === total)", () => {
    const allConfirmedAttendees: AttendeeCountType = {
      yes: 20,
      maybe: 0,
      total: 20,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={allConfirmedAttendees}
      />,
    );
    expect(screen.getByText("20 people attending")).toBeInTheDocument();
  });

  test("Renders Join button", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(screen.getByRole("button", { name: /Join/i })).toBeInTheDocument();
  });

  test("Shows loading spinner when loading is true", () => {
    const { container } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={true}
      />,
    );
    // Check for CircularProgress component
    expect(
      container.querySelector("[class*='MuiCircularProgress']"),
    ).toBeInTheDocument();
  });

  test("Does not show card content when loading is true", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={true}
      />,
    );
    expect(
      screen.queryByText("Morning Powder Run at Snowbowl"),
    ).not.toBeInTheDocument();
  });

  test("Generates user initials correctly from user props", () => {
    const { container } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    // Avatar should contain "EJ" (Emma Johnson initials)
    expect(container.querySelector("[class*='MuiAvatar']")).toHaveTextContent(
      "EJ",
    );
  });

  test("Uses event title initials when user is null", () => {
    const { container } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={[]}
        user={null}
        attendingCount={mockAttendingCount}
      />,
    );
    // Avatar should contain "MO" (Morning Powder Run first 2 letters)
    expect(container.querySelector("[class*='MuiAvatar']")).toHaveTextContent(
      "MO",
    );
  });

  test("Handles empty event tags gracefully", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={[]}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
    // Should not error out
  });

  test("Handles missing attendingCount gracefully", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={undefined}
      />,
    );
    expect(screen.getByText("0 people attending")).toBeInTheDocument();
  });

  test("Handles user with missing first or last name", () => {
    const userWithMissingName: Tables<"users"> = {
      ...mockUser,
      first_name: "",
      last_name: "",
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={userWithMissingName}
        attendingCount={mockAttendingCount}
      />,
    );
    // Should still render without errors
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });

  test("Avatar is clickable link when user is provided", () => {
    const { container } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
      />,
    );
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", `/profile/${mockUser.id}`);
  });

  test("Avatar is not a link when user is null", () => {
    const { container } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={[]}
        user={null}
        attendingCount={mockAttendingCount}
      />,
    );
    const link = container.querySelector("a");
    expect(link).not.toBeInTheDocument();
  });

  test("Displays correct attendee text for single person", () => {
    const singleAttendee: AttendeeCountType = {
      yes: 1,
      maybe: 0,
      total: 1,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={singleAttendee}
      />,
    );
    expect(screen.getByText("1 person attending")).toBeInTheDocument();
  });

  test("Displays correct attendee text for multiple people", () => {
    const multipleAttendees: AttendeeCountType = {
      yes: 5,
      maybe: 3,
      total: 9,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={multipleAttendees}
      />,
    );
    expect(screen.getByText("5-9 people attending")).toBeInTheDocument();
  });

  test("Handles attendingCount.yes = 0 correctly", () => {
    const zeroConfirmed: AttendeeCountType = {
      yes: 0,
      maybe: 5,
      total: 7,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={zeroConfirmed}
      />,
    );
    // When yes is 0, should display total only
    expect(screen.getByText("7 people attending")).toBeInTheDocument();
  });
});
