import { supabase } from "@/lib/supabase_client";

async function resizeAndCropImage(
  image: File,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    img.onload = () => {
      const scale = Math.max(
        targetWidth / img.width,
        targetHeight / img.height,
      );
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const x = (targetWidth - scaledWidth) / 2;
      const y = (targetHeight - scaledHeight) / 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
          URL.revokeObjectURL(objectUrl);
        },
        "image/jpeg",
        0.9,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  });
}

export async function uploadProfileImage(
  userId: string,
  image: File,
): Promise<string> {
  const processedBlob = await resizeAndCropImage(image, 500, 500);

  // Use naming convention: {userId}-{timestamp}-profile.jpeg
  const imagePath = `${userId}-${Date.now()}-profile.jpeg`;

  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(imagePath, processedBlob);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  return imagePath;
}

export async function uploadBannerImage(
  userId: string,
  image: File,
): Promise<string> {
  const processedBlob = await resizeAndCropImage(image, 1200, 300);

  // Use naming convention: {userId}-{timestamp}-banner.jpeg
  const imagePath = `${userId}-${Date.now()}-banner.jpeg`;

  const { error } = await supabase.storage
    .from("banner-photos")
    .upload(imagePath, processedBlob);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  return imagePath;
}

export async function uploadGalleryImage(
  userId: string,
  image: File,
): Promise<string> {
  const processedBlob = await resizeAndCropImage(image, 800, 800);

  // Use naming convention: {userId}-{timestamp}.jpeg
  const imagePath = `${userId}-${Date.now()}.jpeg`;

  const { error: uploadError } = await supabase.storage
    .from("gallery-photos")
    .upload(imagePath, processedBlob);

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Insert record in database
  const { error: dbError } = await supabase.from("gallery_photos").insert({
    //biome-ignore lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy>
    user_id: userId,
    //biome-ignore lint/style/useNamingConvention: <Using snake_case for DB types to make Supabase happy>
    photo_path: imagePath,
  });

  if (dbError) {
    // Clean up uploaded file if database insert fails
    await supabase.storage.from("gallery-photos").remove([imagePath]);
    throw new Error(`Failed to save to database: ${dbError.message}`);
  }

  return imagePath;
}
