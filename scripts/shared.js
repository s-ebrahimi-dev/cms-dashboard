import { loadComponent } from "./components/component-Loader.js";

import { initSidebar } from "./modules/sidebar.js";
import { initNotifications,  closeNotificationModal, } from "./modules/notifications.js";

import { base_URL } from "./config.js";

import { initLogoutModal } from "./modules/logout.js";

import { getMe } from "./funcs/auth.js";

import {
  initDeleteUserModal,
  initEditUserModal,
  initChatUserModal,
} from "./funcs/shared.js";

const loadUserImage = async () => {
  const userImages = document.querySelectorAll(".user-image");

  if (!userImages.length) return;

  try {
    const user = await getMe();

    if (!user?.data?.hasProfileImage) return;

    userImages.forEach((userImage) => {
      userImage.src = `${base_URL}/users/profile-image`;
    });
  } catch (error) {
    console.error("Failed to load user image:", error);
  }
};

const loadUserInfos = async () => {
  const userInfosElem = document.querySelectorAll("#user-infos")
  if (!userInfosElem) return
  try {
    const user = await getMe()
    if (!user?.data) return
    const { firstname, lastname, role } = user.data;
    userInfosElem.forEach((elem) => { 
             const nameElem = elem.querySelector(".user-name");
      const roleElem = elem.querySelector(".user-role");
      const emailElem = elem.querySelector(".user-email");

  if (nameElem) {
      nameElem.textContent =
        [firstname, lastname].filter(Boolean).join(" ") || "User";
    }

    if (roleElem) {
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

      roleElem.textContent = roleLabels[role] || role || "User";
      }
      if(emailElem) {
        emailElem.textContent = user.data.email || "";
      }
    })

  } catch (error) {
    console.error("Failed to load user information:", error);
  }
}

const initUserProfile = () => {
  const userProfile = document.querySelector("#user-profile");
  const userMenu = document.querySelector(".user-menu");

  if (!userProfile || !userMenu) return;

  userProfile.addEventListener("click", (event) => {
    event.stopPropagation();
    userProfile.classList.toggle("open");
      closeNotificationModal();

    userMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    if (
      !userMenu.contains(event.target) &&
      !userProfile.contains(event.target)
    ) {
      userMenu.classList.add("hidden");
      userProfile.classList.remove("open");
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
  initSidebar(user.data);
}

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