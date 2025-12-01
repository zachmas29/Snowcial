/** biome-ignore-all lint/style/useNamingConvention: <using test conventions> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import AttendeeList from "@/components/AttendeeList";

const mockRsvps = [
  {
    user_id: "user-1",
    status: "yes" as const,
    created_at: "2025-01-01T10:00:00Z",
    users: {
      first_name: "Alice",
      last_name: "Smith",
      profile_photo_path: null,
    },
  },
  {
    user_id: "user-2",
    status: "yes" as const,
    created_at: "2025-01-01T11:00:00Z",
    users: {
      first_name: "Bob",
      last_name: "Johnson",
      profile_photo_path: null,
    },
  },
  {
    user_id: "user-3",
    status: "yes" as const,
    created_at: "2025-01-01T12:00:00Z",
    users: {
      first_name: "Charlie",
      last_name: "Brown",
      profile_photo_path: null,
    },
  },
  {
    user_id: "user-4",
    status: "maybe" as const,
    created_at: "2025-01-01T13:00:00Z",
    users: {
      first_name: "Diana",
      last_name: "Prince",
      profile_photo_path: null,
    },
  },
];

describe("AttendeeList", () => {
  test("Smoke test - renders without crashing", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={null} />);
    expect(screen.getByText("Attendees")).toBeInTheDocument();
  });

  test("Displays confirmed attendees count", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={null} />);
    expect(screen.getByText(/Going \(3\)/i)).toBeInTheDocument();
  });

  test("Displays maybe attendees count", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={null} />);
    expect(screen.getByText(/Maybe \(1\)/i)).toBeInTheDocument();
  });

  test("Displays all confirmed attendee names", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={null} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    expect(screen.getByText("Charlie Brown")).toBeInTheDocument();
  });

  test("Displays maybe attendee names", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={null} />);
    expect(screen.getByText("Diana Prince")).toBeInTheDocument();
  });

  test("Shows unlimited capacity message when capacity is null", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={null} />);
    expect(
      screen.getByText(/3 attending • Unlimited capacity/i),
    ).toBeInTheDocument();
  });

  test("Shows capacity info when capacity is set", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={10} />);
    expect(screen.getByText(/3 \/ 10 spots filled/i)).toBeInTheDocument();
  });

  test("Shows spots remaining when capacity not full", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={10} />);
    expect(screen.getByText(/7 spots remaining/i)).toBeInTheDocument();
  });

  test("Does not show spots remaining when capacity is full", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={3} />);
    expect(screen.queryByText(/spots remaining/i)).not.toBeInTheDocument();
  });

  test("Displays waitlist when capacity exceeded", () => {
    const manyRsvps = [
      ...mockRsvps,
      {
        user_id: "user-5",
        status: "yes" as const,
        created_at: "2025-01-01T14:00:00Z",
        users: {
          first_name: "Eve",
          last_name: "Wilson",
          profile_photo_path: null,
        },
      },
      {
        user_id: "user-6",
        status: "yes" as const,
        created_at: "2025-01-01T15:00:00Z",
        users: {
          first_name: "Frank",
          last_name: "Davis",
          profile_photo_path: null,
        },
      },
    ];

    render(<AttendeeList rsvps={manyRsvps} capacity={3} />);
    expect(screen.getByText(/Waitlist \(2\)/i)).toBeInTheDocument();
  });

  test("Shows correct people on waitlist in order", () => {
    const manyRsvps = [
      {
        user_id: "user-1",
        status: "yes" as const,
        created_at: "2025-01-01T10:00:00Z",
        users: {
          first_name: "First",
          last_name: "Confirmed",
          profile_photo_path: null,
        },
      },
      {
        user_id: "user-2",
        status: "yes" as const,
        created_at: "2025-01-01T11:00:00Z",
        users: {
          first_name: "Second",
          last_name: "Confirmed",
          profile_photo_path: null,
        },
      },
      {
        user_id: "user-3",
        status: "yes" as const,
        created_at: "2025-01-01T12:00:00Z",
        users: {
          first_name: "First",
          last_name: "Waitlist",
          profile_photo_path: null,
        },
      },
      {
        user_id: "user-4",
        status: "yes" as const,
        created_at: "2025-01-01T13:00:00Z",
        users: {
          first_name: "Second",
          last_name: "Waitlist",
          profile_photo_path: null,
        },
      },
    ];

    render(<AttendeeList rsvps={manyRsvps} capacity={2} />);

    // First 2 should be in confirmed section
    expect(screen.getByText("First Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Second Confirmed")).toBeInTheDocument();

    // Next 2 should be in waitlist section
    expect(screen.getByText("First Waitlist")).toBeInTheDocument();
    expect(screen.getByText("Second Waitlist")).toBeInTheDocument();

    // Verify section headers exist
    expect(screen.getByText(/Going \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Waitlist \(2\)/i)).toBeInTheDocument();
  });

  test("Shows waitlist count in header", () => {
    const manyRsvps = [...mockRsvps.slice(0, 3)];
    for (let i = 0; i < 5; i++) {
      manyRsvps.push({
        user_id: `user-${i + 10}`,
        status: "yes" as const,
        created_at: `2025-01-01T${14 + i}:00:00Z`,
        users: {
          first_name: `User${i}`,
          last_name: "Waitlisted",
          profile_photo_path: null,
        },
      });
    }

    render(<AttendeeList rsvps={manyRsvps} capacity={3} />);
    expect(screen.getByText(/5 on waitlist/i)).toBeInTheDocument();
  });

  test("Displays empty state when no RSVPs", () => {
    render(<AttendeeList rsvps={[]} capacity={null} />);
    expect(
      screen.getByText(/No RSVPs yet. Be the first!/i),
    ).toBeInTheDocument();
  });

  test("Does not show Going section when no confirmed attendees", () => {
    const maybeOnlyRsvps = [
      {
        user_id: "user-1",
        status: "maybe" as const,
        created_at: "2025-01-01T10:00:00Z",
        users: {
          first_name: "Maybe",
          last_name: "Person",
          profile_photo_path: null,
        },
      },
    ];

    render(<AttendeeList rsvps={maybeOnlyRsvps} capacity={null} />);
    expect(screen.queryByText(/Going \(/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Maybe \(1\)/i)).toBeInTheDocument();
  });

  test("Does not show Maybe section when no maybe attendees", () => {
    const yesOnlyRsvps = mockRsvps.filter((r) => r.status === "yes");

    render(<AttendeeList rsvps={yesOnlyRsvps} capacity={null} />);
    expect(screen.getByText(/Going \(3\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/Maybe \(/i)).not.toBeInTheDocument();
  });

  test("Renders profile links for attendees", () => {
    const { container } = render(
      <AttendeeList rsvps={mockRsvps} capacity={null} />,
    );
    const links = container.querySelectorAll("a");

    // Should have links for all attendees
    expect(links.length).toBeGreaterThanOrEqual(4);

    // Check first link points to correct profile
    expect(links[0]).toHaveAttribute("href", "/profile/user-1");
  });

  test("Displays user initials in avatars", () => {
    const { container } = render(
      <AttendeeList rsvps={mockRsvps} capacity={null} />,
    );
    const avatars = container.querySelectorAll("[class*='MuiAvatar']");

    // Should have avatars for all attendees
    expect(avatars.length).toBeGreaterThanOrEqual(4);

    // Check first avatar has correct initial
    expect(avatars[0]).toHaveTextContent("A");
  });

  test("Handles capacity of 0 correctly", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={0} />);
    // All yes RSVPs should be on waitlist
    expect(screen.getByText(/Waitlist \(3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 0 spots filled/i)).toBeInTheDocument();
  });

  test("Handles capacity of 1 correctly", () => {
    render(<AttendeeList rsvps={mockRsvps} capacity={1} />);
    expect(screen.getByText(/Going \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Waitlist \(2\)/i)).toBeInTheDocument();
  });

  test("Handles large number of attendees", () => {
    const manyRsvps = [];
    for (let i = 0; i < 50; i++) {
      manyRsvps.push({
        user_id: `user-${i}`,
        status: "yes" as const,
        created_at: `2025-01-01T${10 + i}:00:00Z`,
        users: {
          first_name: `User${i}`,
          last_name: "Test",
          profile_photo_path: null,
        },
      });
    }

    render(<AttendeeList rsvps={manyRsvps} capacity={null} />);
    expect(screen.getByText(/Going \(50\)/i)).toBeInTheDocument();
    expect(
      screen.getByText(/50 attending • Unlimited capacity/i),
    ).toBeInTheDocument();
  });

  test("Displays divider between sections", () => {
    const manyRsvps = [
      ...mockRsvps,
      {
        user_id: "user-5",
        status: "yes" as const,
        created_at: "2025-01-01T14:00:00Z",
        users: {
          first_name: "Waitlist",
          last_name: "Person",
          profile_photo_path: null,
        },
      },
    ];

    const { container } = render(
      <AttendeeList rsvps={manyRsvps} capacity={3} />,
    );
    const dividers = container.querySelectorAll("[class*='MuiDivider']");

    // Should have dividers between sections
    expect(dividers.length).toBeGreaterThan(0);
  });

  test("Maybe attendees not affected by capacity limit", () => {
    const mixedRsvps = [
      {
        user_id: "user-1",
        status: "yes" as const,
        created_at: "2025-01-01T10:00:00Z",
        users: {
          first_name: "Yes",
          last_name: "Person",
          profile_photo_path: null,
        },
      },
      {
        user_id: "user-2",
        status: "maybe" as const,
        created_at: "2025-01-01T11:00:00Z",
        users: {
          first_name: "Maybe",
          last_name: "Person",
          profile_photo_path: null,
        },
      },
    ];

    render(<AttendeeList rsvps={mixedRsvps} capacity={1} />);

    // Maybe should still show even though capacity is 1
    expect(screen.getByText(/Maybe \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText("Maybe Person")).toBeInTheDocument();
  });

  test("Handles attendee with profile photo path", () => {
    const rsvpsWithPhoto = [
      {
        user_id: "user-1",
        status: "yes" as const,
        created_at: "2025-01-01T10:00:00Z",
        users: {
          first_name: "Photo",
          last_name: "User",
          profile_photo_path: "https://example.com/photo.jpg",
        },
      },
    ];

    const { container } = render(
      <AttendeeList rsvps={rsvpsWithPhoto} capacity={null} />,
    );
    const avatar = container.querySelector("[class*='MuiAvatar']");

    // Avatar should have src attribute
    expect(avatar?.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg",
    );
  });
});
