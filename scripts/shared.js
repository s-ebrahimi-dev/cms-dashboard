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
  const userImages = document.querySelectorAll(".user-image");

  if (!userImages) return;

  try {
    const user = await getMe();

    if (!user?.data?.hasProfileImage) return;
    userImages.forEach((userImage) => {
   userImage.src = `${base_URL}/users/profile-image`;
})
   
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

const compactView = document.querySelector("#notification-compact-view");
const expandedView = document.querySelector("#notification-expanded-view");

const viewAllNotifications = document.querySelector(
  "#view-all-notifications",
);

const backToNotifications = document.querySelector(
  "#back-to-notifications",
);

// Open notification modal
const openNotificationModal = () => {
  messageNotificationModal.classList.remove(
    "opacity-0",
    "invisible",
  );

  messageNotificationModal.classList.add(
    "opacity-100",
    "visible",
  );
};

// Close notification modal
const closeNotificationModal = () => {
  collapseNotificationModal();

  messageNotificationModal.classList.remove(
    "opacity-100",
    "visible",
  );

  messageNotificationModal.classList.add(
    "opacity-0",
    "invisible",
  );
};

// Show compact view
const showCompactView = () => {
  compactView.classList.remove("hidden");
  expandedView.classList.add("hidden");
};

// Show expanded view
const showExpandedView = () => {
  compactView.classList.add("hidden");
  expandedView.classList.remove("hidden");
};


// Notification button
messageNotif.addEventListener("click", (event) => {
  event.stopPropagation();

  // Always start with compact view when opening
  showCompactView();

  // Toggle modal
  const isOpen =
    messageNotificationModal.classList.contains("visible");

  if (isOpen) {
    closeNotificationModal();
  } else {
    openNotificationModal();
  }
});


// Outside click
document.addEventListener("click", (event) => {
  const clickedInsideModal =
    messageNotificationModal.contains(event.target);

  const clickedNotification =
    messageNotif.contains(event.target);

  if (!clickedInsideModal && !clickedNotification) {
    closeNotificationModal();
  }
});

const expandNotificationModal = () => {
  if (window.innerWidth >= 1280) {
    messageNotificationModal.classList.add(
      "w-[680px]",
      "h-[680px]",
    );
  } else if (window.innerWidth >= 1024) {
    messageNotificationModal.classList.add(
      "w-[640px]",
      "h-[640px]",
    );
  } else if (window.innerWidth >= 768) {
    messageNotificationModal.classList.add(
      "w-[600px]",
      "h-[600px]",
    );
  } else {
    messageNotificationModal.classList.add(
      "w-[calc(100vw-2rem)]",
      "h-[calc(100vw-2rem)]",
      "right-4",
    );

    messageNotificationModal.classList.remove(
      "right-0",
      "right-1/2",
      "translate-x-1/2",
    );
  }

  messageNotificationModal.classList.remove("absolute");
  messageNotificationModal.classList.add("fixed");

  showExpandedView();
};
const collapseNotificationModal = () => {
  messageNotificationModal.classList.remove(
    "w-[680px]",
    "h-[680px]",
    "w-[640px]",
    "h-[640px]",
    "w-[600px]",
    "h-[600px]",
    "w-[calc(100vw-2rem)]",
    "h-[calc(100vw-2rem)]",
    "right-4",
    "right-1/2",
    "translate-x-1/2",
    "fixed",
  );

  messageNotificationModal.classList.add(
    "w-80",
    "h-auto",
    "right-0",
    "absolute",
  );

  showCompactView();
};

// View all notifications
viewAllNotifications.addEventListener("click", (event) => {
  event.stopPropagation();

  expandNotificationModal();
});


// Back button
backToNotifications.addEventListener("click", (event) => {
  event.stopPropagation();

  collapseNotificationModal();
});
