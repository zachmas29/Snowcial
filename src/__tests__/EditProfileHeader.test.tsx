/** biome-ignore-all lint/style/useNamingConvention: <component props and test naming> */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import EditProfileHeader from "@/components/EditProfileHeader";

vi.mock("@mui/material/styles", () => ({
  useTheme: () => ({
    palette: {
      primary: { main: "#0000ff" },
      secondary: { main: "#00ff00" },
    },
  }),
}));

describe("EditProfileHeader", () => {
  it("renders fallback text when no profile photo is provided", () => {
    render(
      <EditProfileHeader
        bannerUrl={null}
        photoUrl={null}
        onChangeProfilePhoto={vi.fn()}
        onChangeBannerPhoto={vi.fn()}
      />,
    );

    expect(screen.getByText("No photo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Change photo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Change banner/i }),
    ).toBeInTheDocument();
  });

  it("calls onChangeProfilePhoto when a profile file is selected", () => {
    const onChangeProfilePhoto = vi.fn();

    const { getByRole } = render(
      <EditProfileHeader
        bannerUrl={null}
        photoUrl={null}
        onChangeProfilePhoto={onChangeProfilePhoto}
        onChangeBannerPhoto={vi.fn()}
      />,
    );

    const file = new File(["avatar"], "avatar.jpg", { type: "image/jpeg" });
    const input = getByRole("button", { name: /Change photo/i }).querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onChangeProfilePhoto).toHaveBeenCalledWith(file);
  });

  it("calls onChangeBannerPhoto when a banner file is selected", () => {
    const onChangeBannerPhoto = vi.fn();

    const { getByRole } = render(
      <EditProfileHeader
        bannerUrl={null}
        photoUrl={null}
        onChangeProfilePhoto={vi.fn()}
        onChangeBannerPhoto={onChangeBannerPhoto}
      />,
    );

    const file = new File(["banner"], "banner.jpg", { type: "image/jpeg" });
    const input = getByRole("button", { name: /Change banner/i }).querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onChangeBannerPhoto).toHaveBeenCalledWith(file);
  });
});
