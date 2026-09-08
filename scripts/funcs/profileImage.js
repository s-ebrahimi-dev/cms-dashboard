import { base_URL } from "../config.js";

export function previewProfileImage(file, element) {
  element.src = URL.createObjectURL(file);
}

export async function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append("profileImage", file);

  const response = await fetch(
    `${base_URL}/users/profile-image`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}