/** biome-ignore-all lint/style/useNamingConvention: <component props and test naming> */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import EditProfileGallery from "@/components/EditProfileGallery";
import { getPublicUrl } from "@/lib/getPublicURL";
import type { Tables } from "@/types/database.types";

vi.mock("@/lib/getPublicURL", () => ({
  getPublicUrl: vi.fn(),
}));

describe("EditProfileGallery", () => {
  const basePhotos: Tables<"gallery_photos">[] = [
    {
      user_id: "user-1",
      photo_path: "photo-1.jpg",
      created_at: "2025-01-01T00:00:00Z",
    },
  ];

  it("renders gallery count and images when photos are provided", () => {
    (getPublicUrl as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      "https://cdn.example.com/photo-1.jpg",
    );

    render(
      <EditProfileGallery
        photos={basePhotos}
        maxPhotos={6}
        onAddPhoto={vi.fn()}
        onDeletePhoto={vi.fn()}
      />,
    );

    expect(screen.getByText(/Gallery \(1\/6\)/)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Image gallery image 1/i }),
    ).toBeInTheDocument();
  });

  it("calls onAddPhoto when a new file is selected", () => {
    const onAddPhoto = vi.fn();

    render(
      <EditProfileGallery
        photos={[]}
        maxPhotos={6}
        onAddPhoto={onAddPhoto}
        onDeletePhoto={vi.fn()}
      />,
    );

    const file = new File(["gallery"], "gallery.jpg", { type: "image/jpeg" });
    const input = screen
      .getByRole("button", { name: /Add Photo/i })
      .querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onAddPhoto).toHaveBeenCalledWith(file);
  });

  it("calls onDeletePhoto when delete button is clicked", () => {
    const onDeletePhoto = vi.fn();
    (getPublicUrl as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      "https://cdn.example.com/photo-1.jpg",
    );

    render(
      <EditProfileGallery
        photos={basePhotos}
        maxPhotos={6}
        onAddPhoto={vi.fn()}
        onDeletePhoto={onDeletePhoto}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Delete photo/i));

    expect(onDeletePhoto).toHaveBeenCalledWith("photo-1.jpg");
  });

  it("hides the add button when maxPhotos reached", () => {
    render(
      <EditProfileGallery
        photos={basePhotos}
        maxPhotos={1}
        onAddPhoto={vi.fn()}
        onDeletePhoto={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /Add Photo/i })).toBeNull();
  });
});
