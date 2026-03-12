"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export async function uploadProjectImage(formData: FormData) {
  try {
    const file = formData.get("image") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file || !title) {
      return { error: "File and title are required." };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save image to public/uploads
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Save metadata to data.json
    const metadataPath = path.join(uploadDir, "data.json");
    let existingData = [];
    try {
      const dataStr = await fs.readFile(metadataPath, "utf-8");
      existingData = JSON.parse(dataStr);
    } catch (e) {
      existingData = [];
    }

    const newEntry = {
      id: Date.now(),
      title,
      description: description || "",
      imageUrl: `/uploads/${filename}`,
      date: new Date().toISOString(),
    };

    existingData.unshift(newEntry);
    await fs.writeFile(metadataPath, JSON.stringify(existingData, null, 2));

    revalidatePath("/gallery");
    return { success: true, message: "Upload successful!" };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image." };
  }
}
