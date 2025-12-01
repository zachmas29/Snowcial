/** biome-ignore-all lint/style/useNamingConvention: <using test conventions> */
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import RSVPButton from "@/components/RSVPButton";
import * as dbFunctions from "@/lib/db_functions";

// Mock the database functions
vi.mock("@/lib/db_functions", () => ({
  upsertRSVP: vi.fn(),
  deleteRSVP: vi.fn(),
}));

const mockRsvps = [
  { status: "yes" },
  { status: "yes" },
  { status: "yes" },
  { status: "maybe" },
  { status: "maybe" },
];

describe("RSVPButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Smoke test - renders without crashing", () => {
    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Going/i })).toBeInTheDocument();
  });

  test("Displays Going and Maybe buttons when no RSVP exists", () => {
    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /^Going$/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Maybe/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Cancel/i }),
    ).not.toBeInTheDocument();
  });

  test("Shows Cancel button when user has RSVPed", () => {
    render(
      <RSVPButton
        eventId={1}
        currentStatus="yes"
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("Shows Going button as contained/active when status is yes", () => {
    render(
      <RSVPButton
        eventId={1}
        currentStatus="yes"
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    const goingButton = screen.getByRole("button", { name: /Going/i });
    expect(goingButton.className).toContain("MuiButton-contained");
  });

  test("Shows Maybe button as contained/active when status is maybe", () => {
    render(
      <RSVPButton
        eventId={1}
        currentStatus="maybe"
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    const maybeButton = screen.getByRole("button", { name: /Maybe/i });
    expect(maybeButton.className).toContain("MuiButton-contained");
  });

  test("Displays 'Join Waitlist' when event is full and user hasn't RSVPed yes", async () => {
    const fullRsvps = Array(10).fill({ status: "yes" });
    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={10}
        rsvps={fullRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Join Waitlist/i }),
    ).toBeInTheDocument();
  });

  test("Displays 'Going' when event is full but user already has yes status", () => {
    const fullRsvps = Array(10).fill({ status: "yes" });
    render(
      <RSVPButton
        eventId={1}
        currentStatus="yes"
        capacity={10}
        rsvps={fullRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Going/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Join Waitlist/i }),
    ).not.toBeInTheDocument();
  });

  test("Calls upsertRSVP when Going button clicked", async () => {
    const user = userEvent.setup();
    const onRSVPChange = vi.fn();
    const upsertRSVPMock = vi.mocked(dbFunctions.upsertRSVP);

    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={onRSVPChange}
      />,
    );

    const goingButton = screen.getByRole("button", { name: /^Going$/i });
    await user.click(goingButton);

    await waitFor(() => {
      expect(upsertRSVPMock).toHaveBeenCalledWith(1, "test-user-id", "yes");
      expect(onRSVPChange).toHaveBeenCalled();
    });
  });

  test("Calls upsertRSVP when Maybe button clicked", async () => {
    const user = userEvent.setup();
    const onRSVPChange = vi.fn();
    const upsertRSVPMock = vi.mocked(dbFunctions.upsertRSVP);

    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={onRSVPChange}
      />,
    );

    const maybeButton = screen.getByRole("button", { name: /Maybe/i });
    await user.click(maybeButton);

    await waitFor(() => {
      expect(upsertRSVPMock).toHaveBeenCalledWith(1, "test-user-id", "maybe");
      expect(onRSVPChange).toHaveBeenCalled();
    });
  });

  test("Calls deleteRSVP when Cancel button clicked", async () => {
    const user = userEvent.setup();
    const onRSVPChange = vi.fn();
    const deleteRSVPMock = vi.mocked(dbFunctions.deleteRSVP);

    render(
      <RSVPButton
        eventId={1}
        currentStatus="yes"
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={onRSVPChange}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(deleteRSVPMock).toHaveBeenCalledWith(1, "test-user-id");
      expect(onRSVPChange).toHaveBeenCalled();
    });
  });

  test("Calls deleteRSVP when Going button clicked while already Going", async () => {
    const user = userEvent.setup();
    const deleteRSVPMock = vi.mocked(dbFunctions.deleteRSVP);

    render(
      <RSVPButton
        eventId={1}
        currentStatus="yes"
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );

    const goingButton = screen.getByRole("button", { name: /Going/i });
    await user.click(goingButton);

    await waitFor(() => {
      expect(deleteRSVPMock).toHaveBeenCalledWith(1, "test-user-id");
    });
  });

  test("Shows loading spinner when processing RSVP", async () => {
    const user = userEvent.setup();
    const upsertRSVPMock = vi.mocked(dbFunctions.upsertRSVP);
    upsertRSVPMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );

    const goingButton = screen.getByRole("button", { name: /^Going$/i });
    await user.click(goingButton);

    // Should show loading spinner
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  test("Displays error message when RSVP fails", async () => {
    const user = userEvent.setup();
    const upsertRSVPMock = vi.mocked(dbFunctions.upsertRSVP);
    upsertRSVPMock.mockRejectedValue(new Error("Network error"));

    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );

    const goingButton = screen.getByRole("button", { name: /^Going$/i });
    await user.click(goingButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to update RSVP/i)).toBeInTheDocument();
    });
  });

  test("Disables buttons while loading", async () => {
    const user = userEvent.setup();
    const upsertRSVPMock = vi.mocked(dbFunctions.upsertRSVP);
    upsertRSVPMock.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={mockRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );

    const goingButton = screen.getByRole("button", { name: /^Going$/i });
    await user.click(goingButton);

    // Buttons should be disabled during loading - they're gone, replaced by spinner
    expect(
      screen.queryByRole("button", { name: /^Going$/i }),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /^Going$/i }),
      ).toBeInTheDocument();
    });
  });

  test("Handles unlimited capacity (capacity null)", () => {
    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={null}
        rsvps={Array(100).fill({ status: "yes" })}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    // Should show "Going" not "Join Waitlist" even with many RSVPs
    expect(
      screen.getByRole("button", { name: /^Going$/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Join Waitlist/i }),
    ).not.toBeInTheDocument();
  });

  test("Handles capacity with room available", () => {
    const notFullRsvps = Array(5).fill({ status: "yes" });
    render(
      <RSVPButton
        eventId={1}
        currentStatus={null}
        capacity={10}
        rsvps={notFullRsvps}
        userId="test-user-id"
        onRSVPChange={vi.fn()}
      />,
    );
    // Should show "Going" not "Join Waitlist" when not full
    expect(
      screen.getByRole("button", { name: /^Going$/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Join Waitlist/i }),
    ).not.toBeInTheDocument();
  });
});
