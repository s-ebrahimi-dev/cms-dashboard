import { base_URL } from "../config.js";

export function previewProfileImage(file, element) {
  element.src = URL.createObjectURL(file);
}

export async function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append("profileImage", file);

  const response = await fetch(`${base_URL}/users/profile-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function loadProfileImage(element) {
  try {
    const response = await fetch(
      `${base_URL}/users/profile-image`,
      {
        credentials: "include",
      }
    );

    console.log("Profile image GET status:", response.status);

    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.log("Profile image response:", errorText);

      throw new Error("Failed to load profile picture.");
    }

    const blob = await response.blob();

    element.src = URL.createObjectURL(blob);
  } catch (error) {
    console.error("Load profile image error:", error);
  }
}