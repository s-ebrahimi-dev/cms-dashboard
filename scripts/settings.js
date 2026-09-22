import { getMe } from "../scripts/funcs/auth.js";

import {
  previewProfileImage,
  uploadProfileImage,
  loadProfileImage,
} from "../scripts/funcs/profileImage.js";
import { openEditUserModal, initEditUserModal } from "./funcs/shared.js";

let currentUser = null;

const imageInput = document.querySelector("#profile-image");
const profilePreview = document.querySelector("#profile-preview");

const initSettings = async () => {
  try {
    const result = await getMe();

    currentUser = result.data;

    if (currentUser?.hasProfileImage) {
      await loadProfileImage(profilePreview);
    }
  } catch (error) {
    console.error("Failed to initialize settings:", error);
  }
};

await initSettings();
// Image input Handler
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


// Edit User Handle
const editUserBtn = document.querySelector(".editUserBtn")
editUserBtn.addEventListener("click", async () => {

  openEditUserModal(currentUser)
})

// Theme Handle
const themeOptions = document.querySelectorAll(
  'input[name="theme"]'
);

const currentTheme = localStorage.getItem("theme") || "light";

// Apply current theme
document.documentElement.classList.toggle(
  "dark",
  currentTheme === "dark"
);

// Select current option
themeOptions.forEach((option) => {
  option.checked = option.value === currentTheme;

  option.addEventListener("change", () => {
    const selectedTheme = option.value;

    document.documentElement.classList.toggle(
      "dark",
      selectedTheme === "dark"
    );

    localStorage.setItem("theme", selectedTheme);
  });
});