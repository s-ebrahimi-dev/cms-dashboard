import { loadComponent } from "./components/component-Loader.js";
import { initSidebar } from "./modules/sidebar.js";
import { base_URL } from "./config.js";
import { initLogoutModal } from "./modules/logout.js";
import { themeHandler } from "./funcs/utils.js";
import { getMe } from "./funcs/auth.js";
import { initDeleteUserModal } from "./funcs/shared.js";
const user = await getMe()

 console.log("CURRENT USER:", user);  
const themeBtn = document.querySelector(".theme-btn");

const loadUserImage = async () => {
  const userImage = document.querySelector(".user-image");

  if (!userImage) return;

  try {
    const user = await getMe();

    if (!user?.data?.hasProfileImage) return;

    userImage.src = `${base_URL}/users/profile-image`;
  } catch (error) {
    console.error("Failed to load user image:", error);
  }
};
const deleteModalContainer = document.getElementById(
  "delete-user-modal-container",
);

if (deleteModalContainer) {
  await loadComponent(
    "delete-user-modal-container",
    "/Components/delete-user-modal.html",
  );

  initDeleteUserModal();
}
const initShared = async () => {
    await loadComponent("sidebar-container",
        "/Components/sidebar.html");
    
  await loadComponent(
    "mobile-sidebar-container",
    "/Components/mobile-sidebar.html",
  );

  initSidebar();
  loadUserImage();
  const modalContainer = document.getElementById("modal-container");

    

  if (modalContainer) {
    await loadComponent("modal-container", "/Components/logout-modal.html");
    
    initLogoutModal();
  } 

  const loaderContainer = document.getElementById("loader-container");

  if (loaderContainer) {
    await loadComponent("loader-container", "/Components/loader.html");
  }
};


initShared();
themeBtn.addEventListener("click", themeHandler);

