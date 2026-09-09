import { loadComponent } from "./components/component-Loader.js";
import { initSidebar } from "./modules/sidebar.js";
import { base_URL } from "./config.js";
import { initLogoutModal } from "./modules/logout.js";

const initShared = async () => {
    await loadComponent("sidebar-container",
        "/Components/sidebar.html");
    
  await loadComponent(
    "mobile-sidebar-container",
    "/Components/mobile-sidebar.html",
  );

  initSidebar();

  const modalContainer = document.getElementById("modal-container");
  const mobileModalContainer = document.getElementById("mobile-modal-container");
    console.log(mobileModalContainer);
    

  if (modalContainer) {
    await loadComponent("modal-container", "/Components/logout-modal.html");
    
    
    initLogoutModal();
  } else if(mobileModalContainer) {
       await loadComponent("mobile-modal-container", "/Components/logout-modal.html");
    
    
    initLogoutModal();
  }

  const loaderContainer = document.getElementById("loader-container");

  if (loaderContainer) {
    await loadComponent("loader-container", "/Components/loader.html");
  }
};

const userImage = document.querySelector(".user-image");

if (userImage) {
  userImage.src = `${base_URL}/users/profile-image`;
}

initShared();
