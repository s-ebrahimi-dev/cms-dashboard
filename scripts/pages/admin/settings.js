import { getMe } from "../../funcs/auth.js";

import {
  previewProfileImage,
  uploadProfileImage,
  loadProfileImage,
} from "../../funcs/profileImage.js";

const imageInput = document.querySelector("#profile-image");
const profilePreview = document.querySelector("#profile-preview");

const initProfileImage = async () => {
  try {
    const user = await getMe();

    if (user?.data?.hasProfileImage) {
      await loadProfileImage(profilePreview);
     
    }
  } catch (error) {
    console.error("Failed to load profile image:", error);
  }
};

initProfileImage();

imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];

  if (!file) return;

  // Show selected image immediately
  previewProfileImage(file, profilePreview);

  try {
    // Save image to backend/database
    await uploadProfileImage(file);
    // Update all header/sidebar profile images immediately 
    
  const imageURL = URL.createObjectURL(file);
    document.querySelectorAll(".user-image").forEach((image) => image.src = imageURL);

    console.log("Profile picture uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});


const darkModeToggle = document.querySelector("#dark-mode-toggle");

const currentTheme = localStorage.getItem("theme");

darkModeToggle.checked = currentTheme === "dark";

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});