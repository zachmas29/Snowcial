/** biome-ignore-all lint/style/useNamingConvention: <using supabase styling conventions> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import SmallEventCard from "@/components/SmallEventCard";
import type { AttendeeCountType } from "@/types/AttendeeCountType.type";
import type { Tables } from "@/types/database.types";

const mockEvent: Tables<"events"> = {
  id: 1,
  title: "Morning Powder Run at Snowbowl",
  description:
    "Fresh snow expected tonight! Let's meet at the base lodge at 9am for first tracks. All levels welcome, we'll split into groups by ability.",
  event_time: "2025-11-15T12:00:00.000Z",
  creator_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  created_at: "2025-11-01T12:00:00+00:00",
  last_updated: "2025-11-01T12:00:00+00:00",
  capacity: null,
};

const mockUser: Tables<"users"> = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  first_name: "Emma",
  last_name: "Johnson",
  email: "ejohnson@middlebury.edu",
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
  capacity: null,
  waitlistCount: 0,
};

const mockHandleEventClick = vi.fn();

describe("SmallEventCard", () => {
  test("Smoke test - renders without crashing", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={false}
        handleEventClick={mockHandleEventClick}
      />,
    );
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
  });
  test("Snapshot test - renders consistently", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={false}
        handleEventClick={mockHandleEventClick}
      />,
    );
    // Basic DOM assertions to replace snapshot
    expect(
      screen.getByText("Morning Powder Run at Snowbowl"),
    ).toBeInTheDocument();
    expect(screen.getByText("Snowbowl")).toBeInTheDocument();
  });
  test("Renders event title from props", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
      />,
    );
    expect(screen.getByText(/Sat, Nov 15, 12:00 PM/)).toBeInTheDocument();
  });
  test("Renders all event tags", () => {
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
      />,
    );
    expect(screen.getByText("15-22 people attending")).toBeInTheDocument();
  });
  test("Displays attendee count correctly when all confirmed (yes === total)", () => {
    const allConfirmedAttendees: AttendeeCountType = {
      yes: 20,
      maybe: 0,
      total: 20,
      capacity: null,
      waitlistCount: 0,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={allConfirmedAttendees}
        handleEventClick={mockHandleEventClick}
      />,
    );
    expect(screen.getByText("20 people attending")).toBeInTheDocument();
  });
  test("Shows loading spinner when loading is true", () => {
    const { container } = render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        loading={true}
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        user={undefined}
        attendingCount={mockAttendingCount}
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        handleEventClick={mockHandleEventClick}
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
        user={undefined}
        attendingCount={mockAttendingCount}
        handleEventClick={mockHandleEventClick}
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
      capacity: null,
      waitlistCount: 0,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={singleAttendee}
        handleEventClick={mockHandleEventClick}
      />,
    );
    expect(screen.getByText("1 person attending")).toBeInTheDocument();
  });
  test("Displays correct attendee text for multiple people", () => {
    const multipleAttendees: AttendeeCountType = {
      yes: 5,
      maybe: 3,
      total: 9,
      capacity: null,
      waitlistCount: 0,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={multipleAttendees}
        handleEventClick={mockHandleEventClick}
      />,
    );
    expect(screen.getByText("5-9 people attending")).toBeInTheDocument();
  });
  test("Handles attendingCount.yes = 0 correctly", () => {
    const zeroConfirmed: AttendeeCountType = {
      yes: 0,
      maybe: 5,
      total: 7,
      capacity: null,
      waitlistCount: 0,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={zeroConfirmed}
        handleEventClick={() => {}}
      />,
    );
    // When yes is 0, should display total only
    expect(screen.getByText("7 people attending")).toBeInTheDocument();
  });

  test("Handles attendingCount.yes = 0 correctly", () => {
    const zeroConfirmed: AttendeeCountType = {
      yes: 0,
      maybe: 5,
      total: 7,
      capacity: null,
      waitlistCount: 0,
    };
    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={zeroConfirmed}
        handleEventClick={mockHandleEventClick}
      />,
    );
    // When yes is 0, should display total only
    expect(screen.getByText("7 people attending")).toBeInTheDocument();
  });

  test("Navigates to event page when clicked", async () => {
    const user = userEvent.setup();
    const handleEventClick = vi.fn();

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={mockAttendingCount}
        handleEventClick={handleEventClick}
      />,
    );

    const cardElement = screen.getByText(mockEvent.title);

    await user.click(cardElement);
    expect(handleEventClick).toHaveBeenCalledWith(mockEvent.id);
  });

  test("Displays capacity when set", () => {
    const withCapacity: AttendeeCountType = {
      yes: 5,
      maybe: 2,
      total: 7,
      capacity: 10,
      waitlistCount: 0,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={withCapacity}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/5-7 \/ 10 people attending/i)).toBeInTheDocument();
  });

  test("Displays waitlist count when present", () => {
    const withWaitlist: AttendeeCountType = {
      yes: 12,
      maybe: 3,
      total: 15,
      capacity: 10,
      waitlistCount: 2,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={withWaitlist}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/\(2 waitlisted\)/i)).toBeInTheDocument();
  });

  test("Shows 'Full' chip when event is at capacity", () => {
    const fullEvent: AttendeeCountType = {
      yes: 10,
      maybe: 2,
      total: 12,
      capacity: 10,
      waitlistCount: 0,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={fullEvent}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Full")).toBeInTheDocument();
  });

  test("Shows 'Full' chip when event exceeds capacity", () => {
    const overCapacity: AttendeeCountType = {
      yes: 15,
      maybe: 2,
      total: 17,
      capacity: 10,
      waitlistCount: 5,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={overCapacity}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Full")).toBeInTheDocument();
  });

  test("Does not show 'Full' chip when event has capacity remaining", () => {
    const notFull: AttendeeCountType = {
      yes: 5,
      maybe: 2,
      total: 7,
      capacity: 10,
      waitlistCount: 0,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={notFull}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.queryByText("Full")).not.toBeInTheDocument();
  });

  test("Does not show 'Full' chip when capacity is unlimited", () => {
    const unlimitedCapacity: AttendeeCountType = {
      yes: 100,
      maybe: 50,
      total: 150,
      capacity: null,
      waitlistCount: 0,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={unlimitedCapacity}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.queryByText("Full")).not.toBeInTheDocument();
  });

  test("Displays capacity with single attendee correctly", () => {
    const singleWithCapacity: AttendeeCountType = {
      yes: 1,
      maybe: 0,
      total: 1,
      capacity: 5,
      waitlistCount: 0,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={singleWithCapacity}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/1 \/ 5 person attending/i)).toBeInTheDocument();
  });

  test("Handles capacity of 1 correctly", () => {
    const capacityOne: AttendeeCountType = {
      yes: 1,
      maybe: 0,
      total: 1,
      capacity: 1,
      waitlistCount: 0,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={capacityOne}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Full")).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 1 person attending/i)).toBeInTheDocument();
  });

  test("Displays both capacity and waitlist information together", () => {
    const fullWithWaitlist: AttendeeCountType = {
      yes: 13,
      maybe: 2,
      total: 15,
      capacity: 10,
      waitlistCount: 3,
    };

    render(
      <SmallEventCard
        event={mockEvent}
        eventTags={mockEventTags}
        user={mockUser}
        attendingCount={fullWithWaitlist}
        handleEventClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/13-15 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByText(/\(3 waitlisted\)/i)).toBeInTheDocument();
    expect(screen.getByText("Full")).toBeInTheDocument();
  });
});
