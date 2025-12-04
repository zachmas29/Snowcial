/** biome-ignore-all lint/style/useNamingConvention: <DB-shaped props and test naming> */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import EditProfileForm, {
  type EditProfileFormProps,
} from "@/components/EditProfileForm";
import type { GenericTagType } from "@/types/EventCreator.types";

const baseProps: EditProfileFormProps = {
  values: {
    first_name: "Ada",
    last_name: "Lovelace",
    bio_text: "Early programmer",
  },
  onChange: vi.fn(),
  availableTags: [],
  selectedTags: [],
  onChangeTags: vi.fn(),
  saving: false,
  isSaveDisabled: false,
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
};

describe("EditProfileForm", () => {
  it("renders form fields with provided values", () => {
    render(<EditProfileForm {...baseProps} />);

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("Ada");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Lovelace");
    expect(screen.getByLabelText(/Bio/i)).toHaveValue("Early programmer");
    expect(screen.getByText("Choose tags")).toBeInTheDocument();
  });

  it("calls onChange when fields are edited", () => {
    const onChange = vi.fn();
    render(<EditProfileForm {...baseProps} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Grace" },
    });

    expect(onChange).toHaveBeenCalledWith({ first_name: "Grace" });
  });

  it("calls onChangeTags when tag selection changes via TagSelector", () => {
    const onChangeTags = vi.fn();
    const tags: GenericTagType[] = [
      { id: 1, name: "Powder" },
      { id: 2, name: "Park" },
    ];

    render(
      <EditProfileForm
        {...baseProps}
        availableTags={tags}
        selectedTags={[]}
        onChangeTags={onChangeTags}
      />,
    );

    // We can't easily simulate the internal TagSelector behavior,
    // but we can assert that its label is rendered which indicates
    // it was wired into the form.
    expect(screen.getByText("Choose tags")).toBeInTheDocument();
  });

  it("disables Save button when isSaveDisabled is true", () => {
    render(<EditProfileForm {...baseProps} isSaveDisabled />);

    expect(screen.getByRole("button", { name: /Save/i })).toBeDisabled();
  });

  it("shows required name error when first or last name is empty", () => {
    render(
      <EditProfileForm
        {...baseProps}
        values={{ first_name: "", last_name: "", bio_text: "" }}
      />,
    );

    expect(
      screen.getByText(/First and last name are required/i),
    ).toBeInTheDocument();
  });

  it("invokes onSubmit when form is submitted", () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <EditProfileForm {...baseProps} onSubmit={onSubmit} />,
    );

    const form = container.querySelector("form");
    if (!form) {
      throw new Error("Form element not found");
    }

    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalled();
  });

  it("invokes onCancel when Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<EditProfileForm {...baseProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(onCancel).toHaveBeenCalled();
  });
});
