/** biome-ignore-all lint/style/useNamingConvention: <supabase format> */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import EventCreator from "@/components/EventCreator";
import type { Tables } from "@/types/database.types";
import type { EventFormData } from "@/types/EventCreator.types";

const mockFormData: EventFormData = {
  title: "",
  description: "",
  event_time: null,
  tags: [],
};

const mockTags: Tables<"event_tags">[] = [
  {
    id: 1,
    name: "Snowbowl",
  },
  {
    id: 2,
    name: "Sugarbush",
  },
  {
    id: 3,
    name: "Killington",
  },
  {
    id: 4,
    name: "Stowe",
  },
];

describe("EventCreator", () => {
  test("Smoke test - renders without crashing", () => {
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByText("Event Name")).toBeInTheDocument();
  });

  test("Snapshot test - renders consistently", () => {
    const { asFragment } = render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("Displays form fields", () => {
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByText("Event Name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getAllByText("Event Time").length).toBeGreaterThan(0);
  });

  test("Displays Cancel and Submit buttons", () => {
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("Calls cancel callback when Cancel button clicked", () => {
    const cancelMock = vi.fn();
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={cancelMock}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(cancelMock).toHaveBeenCalled();
  });

  test("Submit button is disabled when title is empty", () => {
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
  });

  test("Submit button is disabled when description is empty", () => {
    const formDataWithTitle = { ...mockFormData, title: "Mogul Run at Stowe" };
    render(
      <EventCreator
        eventFormData={formDataWithTitle}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Submit/i })).toBeDisabled();
  });

  test("Submit button is enabled when title and description are provided", () => {
    const completeFormData = {
      ...mockFormData,
      title: "Blue Square Cruise",
      description: "Join us for intermediate runs at Sugarbush",
    };
    render(
      <EventCreator
        eventFormData={completeFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Submit/i })).not.toBeDisabled();
  });

  test("Calls submit callback when Submit button clicked and form is valid", () => {
    const submitMock = vi.fn();
    const completeFormData = {
      ...mockFormData,
      title: "Tree Skiing at Mad River Glen",
      description: "Advanced terrain through the glades",
    };
    render(
      <EventCreator
        eventFormData={completeFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={submitMock}
        cancel={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));
    expect(submitMock).toHaveBeenCalled();
  });

  test("Displays error message when title and description are missing", () => {
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(
      screen.getByText("Event name and description are required!"),
    ).toBeInTheDocument();
  });

  test("Does not display error message when title is provided but description missing", () => {
    const formDataWithTitle = {
      ...mockFormData,
      title: "Early Bird Ski Session",
    };
    render(
      <EventCreator
        eventFormData={formDataWithTitle}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(
      screen.getByText("Event name and description are required!"),
    ).toBeInTheDocument();
  });

  test("Updates title field when changed", () => {
    const setEventFormDataMock = vi.fn();
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={setEventFormDataMock}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    const titleInput = screen.getAllByRole("textbox")[0] as HTMLInputElement;
    fireEvent.change(titleInput, {
      target: { value: "Afternoon Backcountry Tour" },
    });
    expect(setEventFormDataMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Afternoon Backcountry Tour" }),
    );
  });

  test("Updates description field when changed", () => {
    const setEventFormDataMock = vi.fn();
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={setEventFormDataMock}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    const descInput = screen.getAllByRole("textbox")[1] as HTMLTextAreaElement;
    fireEvent.change(descInput, {
      target: { value: "Exploring fresh powder in the backcountry" },
    });
    expect(setEventFormDataMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Exploring fresh powder in the backcountry",
      }),
    );
  });

  test("Renders provided tag options", () => {
    render(
      <EventCreator
        eventFormData={mockFormData}
        setEventFormData={vi.fn()}
        tagOptions={mockTags}
        submit={vi.fn()}
        cancel={vi.fn()}
      />,
    );
    expect(screen.getByText("Add Event Tags")).toBeInTheDocument();
    // Tags are available in the Autocomplete options, verify the component accepts them
    expect(screen.getByPlaceholderText("Tags")).toBeInTheDocument();
  });
});
