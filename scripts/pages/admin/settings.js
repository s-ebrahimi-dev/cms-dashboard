import { loadComponent } from "../../components/component-Loader.js";
import { initSidebar } from "../../modules/sidebar.js";
import {
  previewProfileImage,
  uploadProfileImage,
} from "../../funcs/profileImage.js";
loadComponent(
    "sidebar-container",
    "/Components/sidebar.html"
)
.then(() => {
    initSidebar();
});

const imageInput = document.querySelector("#profile-image");
const profilePreview = document.querySelector("#profile-preview");

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