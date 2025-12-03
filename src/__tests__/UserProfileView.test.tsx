/* biome-ignore-all lint/style/useNamingConvention: <DB-shaped types and test naming> */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserProfileView from "@/components/UserProfileView";
import type { EnrichedEvent, UserProfileData } from "@/types/app.types";

// Mock EventFeed to avoid next/router dependency in tests
vi.mock("@/components/EventFeed", () => ({
  default: () => <div>EventFeed</div>,
}));

// Mock next/image to a simple img for testing
vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) => {
    // biome-ignore lint/performance/noImgElement: using basic img in tests
    return <img alt={props.alt ?? ""} src={props.src ?? ""} />;
  },
}));

vi.mock("@/lib/getPublicURL", () => ({
  getPublicUrl: vi.fn(),
}));

const { getPublicUrl } =
  await vi.importMock<typeof import("@/lib/getPublicURL")>(
    "@/lib/getPublicURL",
  );

describe("UserProfileView", () => {
  const baseProfile: UserProfileData = {
    user: {
      id: "user-1",
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      bio_text: "Pioneer programmer",
      banner_photo_path: null,
      profile_photo_path: null,
      created_at: "2025-01-01T00:00:00Z",
      last_active: "2025-01-01T00:00:00Z",
      last_updated: "2025-01-01T00:00:00Z",
    },
    tags: [],
    galleryPhotos: [],
  };

  const emptyEvents: EnrichedEvent[] = [];

  beforeEach(() => {
    (getPublicUrl as ReturnType<typeof vi.fn>).mockReset();
  });

  it("passes normalized gallery photo URLs to UserGallery", () => {
    const profile: UserProfileData = {
      ...baseProfile,
      galleryPhotos: [
        {
          user_id: "user-1",
          photo_path: "storage-key-1.jpeg",
          created_at: "2025-01-01T00:00:00Z",
        },
      ],
    };

    (getPublicUrl as ReturnType<typeof vi.fn>).mockReturnValue(
      "https://cdn.example.com/storage-key-1.jpeg",
    );

    render(
      <UserProfileView
        profile={profile}
        userEvents={emptyEvents}
        userEventsLoading={false}
        userEventsError={false}
        isOwnProfile={false}
        onEditProfile={() => {}}
      />,
    );

    const img = screen.getByRole("img", { name: /gallery photo/i });
    expect(getPublicUrl).toHaveBeenCalledWith(
      "gallery-photos",
      "storage-key-1.jpeg",
    );
    expect(img).toHaveAttribute(
      "src",
      "https://cdn.example.com/storage-key-1.jpeg",
    );
  });

  it("filters out gallery photos whose public URL cannot be resolved", () => {
    const profile: UserProfileData = {
      ...baseProfile,
      galleryPhotos: [
        {
          user_id: "user-1",
          photo_path: "bad-storage-key.jpeg",
          created_at: "2025-01-01T00:00:00Z",
        },
      ],
    };

    (getPublicUrl as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(
      <UserProfileView
        profile={profile}
        userEvents={emptyEvents}
        userEventsLoading={false}
        userEventsError={false}
        isOwnProfile={false}
        onEditProfile={() => {}}
      />,
    );

    // No gallery img should render when URL resolution fails
    expect(screen.queryByRole("img", { name: /gallery photo/i })).toBeNull();
  });
});
