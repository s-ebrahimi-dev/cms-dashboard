import { base_URL } from "../../config.js";
import {
  previewProfileImage,
  uploadProfileImage, loadProfileImage
} from "../../funcs/profileImage.js";

const imageInput = document.querySelector("#profile-image");
const profilePreview = document.querySelector("#profile-preview");

// Load saved profile image
profilePreview.src = `${base_URL}/users/profile-image`;

imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];

  if (!file) return;

  // Show selected image immediately
  previewProfileImage(file, profilePreview);

  try {
    // Save image to backend/database
    await uploadProfileImage(file);

    console.log("Profile picture uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});