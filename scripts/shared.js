import { loadComponent } from "./components/component-Loader.js";

import { initSidebar } from "./modules/sidebar.js";
import { initNotifications,  closeNotificationModal, } from "./modules/notifications.js";

import { base_URL } from "./config.js";

import { initLogoutModal } from "./modules/logout.js";

import { getMe } from "./funcs/auth.js";

import {
  getAndShowAllEmployees,
  initDeleteUserModal,
  initEditUserModal,
  initChatUserModal,
} from "./funcs/shared.js";
import {
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser

} from "./funcs/state.js";

const roleLabels = {
      ADMIN: "Administrator",
      CUSTOMER: "Customer",
      RECEPTIONIST: "Receptionist",
      MECHANIC: "Mechanic",
      OIL_TECHNICIAN: "Oil Technician",
      BODY_REPAIR: "Body Repair",
      DETAILING_TECHNICIAN: "Detailing Technician",
      WASH_TECHNICIAN: "Wash Technician",
    };

const loadUserImage = async () => {
  const userImages = document.querySelectorAll(".user-image");

  if (!userImages.length) return;

  try {
    const user = getCurrentUser()
  
    if (!user?.hasProfileImage) return;

    userImages.forEach((userImage) => {
      userImage.src = `${base_URL}/users/profile-image`;
    });
  } catch (error) {
    console.error("Failed to load user image:", error);
  }
};

const loadUserInfos = async () => {
  try {
    const user = getCurrentUser()
 
    if (!user) return;

    const { firstname, lastname, role, email } = user;

    const fullName =
      [firstname, lastname].filter(Boolean).join(" ") || "User";

    

    document.querySelectorAll(".user-name").forEach((elem) => {
      elem.textContent = fullName;
    });

    document.querySelectorAll(".user-role").forEach((elem) => {
      elem.textContent = roleLabels[role] || role || "User";
    });

    document.querySelectorAll(".user-email").forEach((elem) => {
      elem.textContent = email || "";
    });
  } catch (error) {
    console.error("Failed to load user information:", error);
  }
};

const initUserProfile = () => {
  const userInfosBtn = document.querySelector("#user-infos");
  const userProfileIcon = document.querySelector("#user-profile");
  const userMenu = document.querySelector(".user-menu");

  if (!userProfileIcon || !userMenu) return;

  userInfosBtn.addEventListener("click", (event) => {
    console.log("clicked");
    
    event.stopPropagation();
    userProfileIcon.classList.toggle("open");
      closeNotificationModal();

    userMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    if (
      !userMenu.contains(event.target) &&
      !userInfosBtn.contains(event.target)
    ) {
      userMenu.classList.add("hidden");
      userProfileIcon.classList.remove("open");
    }
  });
};

const initDynamicModals = async () => {
  const page = document.body.dataset.page;
  const deleteModalContainer = document.getElementById(
    "delete-user-modal-container",
  );

  const editModalContainer = document.querySelector(
    "#edit-user-modal-container",
  );

  const chatUserModalContainer = document.querySelector(
    "#chat-user-modal-container",
  );

  if (deleteModalContainer) {
    await loadComponent(
      "delete-user-modal-container",
      "/Components/delete-user-modal.html",
    );

    initDeleteUserModal();
  }

  if (editModalContainer && page === "users") {
    await loadComponent(
      "edit-user-modal-container",
      "/Components/edit-user-modal.html",
    );

    initEditUserModal();
  }

  if (chatUserModalContainer) {
    await loadComponent(
      "chat-user-modal-container",
      "/Components/chat-user-modal.html",
    );

    initChatUserModal();
  }
};

const initShared = async () => {
  await loadComponent(
    "sidebar-container",
    "/Components/sidebar.html",
  );

  await loadComponent(
    "mobile-sidebar-container",
    "/Components/mobile-sidebar.html",
  );
  

const user = await getMe();

if (user?.data) {
  setCurrentUser(user.data);

  initSidebar(user.data);
}

    document
      .querySelector("#sidebar-container")
    ?.classList.remove("invisible");
  
    document
    .querySelector("#mobile-sidebar-container")
    ?.classList.remove("invisible");


  loadUserImage();
  loadUserInfos();

  await initDynamicModals();

  const modalContainer =
    document.getElementById("modal-container");

  if (modalContainer) {
    await loadComponent(
      "modal-container",
      "/Components/logout-modal.html",
    );

    initLogoutModal();
  }

  const loaderContainer =
    document.getElementById("loader-container");

  if (loaderContainer) {
    await loadComponent(
      "loader-container",
      "/Components/loader.html",
    );
  }

  initUserProfile();

  await initNotifications();
};


initShared();
export {loadUserInfos}