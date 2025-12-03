/* biome-ignore-all lint/style/useNamingConvention: <DB-shaped types and test naming> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserAvatar from "@/components/UserAvatar";
import type { Tables } from "@/types/database.types";

vi.mock("@/lib/getPublicURL", () => ({
  getPublicUrl: vi.fn(),
}));

const { getPublicUrl } =
  await vi.importMock<typeof import("@/lib/getPublicURL")>(
    "@/lib/getPublicURL",
  );

describe("UserAvatar", () => {
  const baseUser: Tables<"users"> = {
    id: "user-1",
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@example.com",
    bio_text: null,
    banner_photo_path: null,
    profile_photo_path: null,
    created_at: "2025-01-01T00:00:00Z",
    last_active: "2025-01-01T00:00:00Z",
    last_updated: "2025-01-01T00:00:00Z",
  };

  beforeEach(() => {
    (getPublicUrl as ReturnType<typeof vi.fn>).mockReset();
  });

  it("uses full URL profile photo when provided", () => {
    const user = {
      ...baseUser,
      profile_photo_path: "https://example.com/avatar.jpg",
    };

    render(<UserAvatar user={user} shouldLink={false} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("resolves storage key via getPublicUrl", () => {
    const user = { ...baseUser, profile_photo_path: "some/storage/key.jpeg" };
    (getPublicUrl as ReturnType<typeof vi.fn>).mockReturnValue(
      "https://cdn.example.com/some/storage/key.jpeg",
    );

    render(<UserAvatar user={user} shouldLink={false} />);

    const img = screen.getByRole("img");
    expect(getPublicUrl).toHaveBeenCalledWith(
      "profile-photos",
      "some/storage/key.jpeg",
    );
    expect(img).toHaveAttribute(
      "src",
      "https://cdn.example.com/some/storage/key.jpeg",
    );
  });

  it("falls back to initials when URL cannot be resolved", () => {
    const user = { ...baseUser, profile_photo_path: "storage-key.jpeg" };
    (getPublicUrl as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<UserAvatar user={user} shouldLink={false} />);

    // Avatar with no image src renders initials
    const img = screen.getByText("AL");
    expect(img).toBeInTheDocument();
  });

  it("uses fallback initials when user is undefined", () => {
    render(
      <UserAvatar user={undefined} shouldLink={false} fallbackInitials="ZZ" />,
    );

    expect(screen.getByText("ZZ")).toBeInTheDocument();
  });
});
