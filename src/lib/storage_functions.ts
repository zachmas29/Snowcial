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
        },
        "image/jpeg",
        0.9,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(image);
  });
}

export async function uploadProfileImage(image: File): Promise<string> {
  const processedBlob = await resizeAndCropImage(image, 500, 500);

  const imagePath = `${crypto.randomUUID()}.jpeg`;

  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(imagePath, processedBlob);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  return imagePath;
}
