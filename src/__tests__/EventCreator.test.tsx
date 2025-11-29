/** biome-ignore-all lint/style/useNamingConvention: <supabase format> */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import EventCreator from "@/components/EventCreator";
import type { EventFormData } from "@/types/EventCreator.types";

// Mock next/router
vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    pathname: "/events/new",
    push: vi.fn(),
    back: vi.fn(),
    query: {},
  })),
}));

const mockFormData: EventFormData = {
  title: "",
  description: "",
  event_time: null,
  tags: [],
};

const renderEventCreatorCreate = (props = {}) => {
  const defaultProps = {
    initialData: undefined, // No initial data = create mode
    onSubmit: vi.fn(),
    handleClick: vi.fn(),
    ...props,
  };
  return render(<EventCreator {...defaultProps} />);
};

const renderEventCreatorEdit = (props = {}) => {
  const defaultProps = {
    initialData: mockFormData, // With initial data = edit mode
    onSubmit: vi.fn(),
    handleClick: vi.fn(),
    ...props,
  };
  return render(<EventCreator {...defaultProps} />);
};
describe("EventCreator", () => {
  test("Smoke test - renders without crashing", () => {
    renderEventCreatorCreate();
    expect(screen.getByText("Event Name")).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    const { asFragment } = renderEventCreatorCreate();
    expect(asFragment()).toMatchSnapshot();
  });

  test("Displays form fields", () => {
    renderEventCreatorCreate();
    expect(screen.getByText("Event Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getAllByText("Event Time").length).toBeGreaterThan(0);
  });

  test("Displays Cancel and Create buttons", () => {
    renderEventCreatorCreate();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  test("Displays Cancel and Save buttons", () => {
    renderEventCreatorEdit();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
  });

  test("Calls handleClick callback when Cancel button clicked", () => {
    const cancelMock = vi.fn();
    renderEventCreatorCreate({ handleClick: cancelMock });
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(cancelMock).toHaveBeenCalled();
  });

  test("Create button is disabled when title is empty", () => {
    renderEventCreatorCreate();
    expect(screen.getByRole("button", { name: /Create/i })).toBeDisabled();
  });

  test("Create button is disabled when description is empty", () => {
    renderEventCreatorCreate();
    fireEvent.change(screen.getByLabelText(/Event Name/i), {
      target: { value: "Mogul Run at Stowe" },
    });
    expect(screen.getByRole("button", { name: /Create/i })).toBeDisabled();
  });

  test("Create button is enabled when title and description are provided", () => {
    renderEventCreatorCreate();
    fireEvent.change(screen.getByLabelText(/Event Name/i), {
      target: { value: "Blue Square Cruise" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Join us for intermediate runs at Sugarbush" },
    });
    expect(screen.getByRole("button", { name: /Create/i })).not.toBeDisabled();
  });

  test("Calls submit callback when Create button clicked and form is valid", async () => {
    const submitMock = vi.fn();
    renderEventCreatorCreate({ onSubmit: submitMock });

    fireEvent.change(screen.getByLabelText(/Event Name/i), {
      target: { value: "Tree Skiing at Mad River Glen" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Advanced terrain through the glades" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(submitMock).toHaveBeenCalled();
    });
  });

  test("Displays error message when title and description are missing", () => {
    renderEventCreatorCreate();
    expect(
      screen.getByText("Event name and description are required!"),
    ).toBeInTheDocument();
  });

  test("Displays error message when title is provided but description missing", () => {
    const formDataWithTitle = {
      ...mockFormData,
      title: "Early Bird Ski Session",
    };
    renderEventCreatorCreate({ initialData: formDataWithTitle });

    expect(
      screen.getByText("Event name and description are required!"),
    ).toBeInTheDocument();
  });

  test("Does not display error message when both title and description are provided", () => {
    const completeFormData = {
      ...mockFormData,
      title: "Test Event",
      description: "Test Description",
    };
    renderEventCreatorCreate({ initialData: completeFormData });

    expect(
      screen.queryByText("Event name and description are required!"),
    ).not.toBeInTheDocument();
  });

  test("Updates title field when changed", () => {
    renderEventCreatorEdit();

    const titleInput = screen.getByLabelText(/Event Name/i);
    fireEvent.change(titleInput, {
      target: { value: "Afternoon Backcountry Tour" },
    });

    expect(titleInput).toHaveValue("Afternoon Backcountry Tour");
  });

  test("Updates description field when changed", () => {
    renderEventCreatorEdit();

    const descInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descInput, {
      target: { value: "Exploring fresh powder in the backcountry" },
    });

    expect(descInput).toHaveValue("Exploring fresh powder in the backcountry");
  });

  test("Renders provided tag options", () => {
    renderEventCreatorCreate();
    expect(screen.getByText("Add Event Tags")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tags")).toBeInTheDocument();
  });

  test("Handles initial data correctly", () => {
    const initialDataWithValues = {
      title: "Pre-filled Event",
      description: "Pre-filled description",
      event_time: null,
      tags: [],
    };

    renderEventCreatorCreate({ initialData: initialDataWithValues });

    expect(screen.getByLabelText(/Event Name/i)).toHaveValue(
      "Pre-filled Event",
    );
    expect(screen.getByLabelText(/Description/i)).toHaveValue(
      "Pre-filled description",
    );
  });
});
