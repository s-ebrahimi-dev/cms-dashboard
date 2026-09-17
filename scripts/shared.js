import { loadComponent } from "./components/component-Loader.js";
import { initSidebar } from "./modules/sidebar.js";
import { base_URL } from "./config.js";
import { initLogoutModal } from "./modules/logout.js";
import { getMe } from "./funcs/auth.js";
import {
  initDeleteUserModal,
  initEditUserModal,
  initChatUserModal,
  getAndShowAllMessages,
} from "./funcs/shared.js";
const roleLabels = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
  RECEPTIONIST: "Receptionist",
  MECHANIC: "Mechanic",
  OIL_TECHNICIAN: "Oil Technician",
  BODY_REPAIR: "Body Repair",
  DETAILING_TECHNICIAN: "Detailing Technician",
  WASH_TECHNICIAN: "Wash Technician",
};

const user = await getMe();

console.log("CURRENT USER:", user);

const loadNotifs = await getAndShowAllMessages();
const userNotifs = loadNotifs?.notifications;
console.log(userNotifs);

const messageNotificationList = document.querySelector(
  "#messageNotificationList",
);
if (userNotifs) {
  messageNotificationList.innerHTML = "";
  userNotifs.forEach((notif) => {
    const unreadCount = userNotifs.filter((notif) => !notif.isRead).length;

    const unreadMessageCount = document.querySelector("#unread-message-count");

    if (unreadCount > 0) {
      unreadMessageCount.textContent = unreadCount;
      unreadMessageCount.classList.remove("hidden");
    } else {
      unreadMessageCount.classList.add("hidden");
    }
    const senderRole = roleLabels[notif.sender.role] || notif.sender.role;
    messageNotificationList.insertAdjacentHTML(
      "beforeend",
      `
        <div
        class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700"
      >
        <div class="mb-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          ${senderRole}
        </div>

        <div class="text-sm font-semibold text-slate-700 dark:text-slate-300">
          ${notif.message}
        </div>
      </div>
      `,
    );
  });
}

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
const editModalContainer = document.querySelector("#edit-user-modal-container");

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
if (editModalContainer) {
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

const initShared = async () => {
  await loadComponent("sidebar-container", "/Components/sidebar.html");

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

// messages-notifications
const messageNotif = document.querySelector("#message-notif");
const messageNotificationModal = document.querySelector(
  "#messageNotificationModal",
);

document.addEventListener("click", (event) => {
  const clickedInsideModal = messageNotificationModal.contains(event.target);
  const clickedNotification = messageNotif.contains(event.target);

  if (!clickedInsideModal && !clickedNotification) {
    messageNotificationModal.classList.remove(
      "opacity-100",
      "scale-100",
      "visible",
    );

    messageNotificationModal.classList.add("opacity-0", "scale-0", "invisible");
  }
});

messageNotif.addEventListener("click", () => {
  messageNotificationModal.classList.toggle("opacity-0");
  messageNotificationModal.classList.toggle("scale-0");
  messageNotificationModal.classList.toggle("invisible");

  messageNotificationModal.classList.toggle("opacity-100");
  messageNotificationModal.classList.toggle("scale-100");
  messageNotificationModal.classList.toggle("visible");
});
