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
const getNotificationStatusIcon = (isRead) => {
  if (isRead) {
    return `
      <span
       class="notification-status-icon mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400"
      ></span>
    `;
  }

  return `
    <span class="notification-status-icon mt-2 h-4 w-4 shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
      >
        <title>mail-16</title>

        <g fill="none">
          <path
            fill="#367af2"
            d="M14 5H2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"
          />

          <path
            fill="url(#SVGaSQrEdmp)"
            d="M14 5H2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"
          />

          <path
            fill="url(#SVGkGyYMdrA)"
            d="M14 5H2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"
          />

          <path
            fill="url(#SVG2rmSNeoq)"
            fill-opacity=".75"
            d="M14 5H2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"
          />

          <path
            fill="url(#SVG86d9mdMU)"
            fill-opacity=".7"
            d="M14 5H2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2z"
          />

          <path
            fill="url(#SVGU4sKxbEp)"
            d="M4 3a2 2 0 0 0-2 2v.84l5.763 3.103a.5.5 0 0 0 .474 0L14 5.84V5a2 2 0 0 0-2-2z"
          />

          <defs>
            <linearGradient
              id="SVGaSQrEdmp"
              x1="9.523"
              x2="13.026"
              y1="6.568"
              y2="12.814"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".228" stop-color="#0094f0" stop-opacity="0" />
              <stop offset=".431" stop-color="#0094f0" />
            </linearGradient>

            <linearGradient
              id="SVGkGyYMdrA"
              x1="6.286"
              x2="2.394"
              y1="5.842"
              y2="13.198"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".228" stop-color="#0094f0" stop-opacity="0" />
              <stop offset=".431" stop-color="#0094f0" />
            </linearGradient>

            <linearGradient
              id="SVG2rmSNeoq"
              x1="11.164"
              x2="11.756"
              y1="9.773"
              y2="13.726"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#2764e7" stop-opacity="0" />
              <stop offset="1" stop-color="#2764e7" />
            </linearGradient>

            <linearGradient
              id="SVG86d9mdMU"
              x1="9.857"
              x2="10.938"
              y1="5.982"
              y2="14.034"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#ff6ce8" stop-opacity="0" />
              <stop offset="1" stop-color="#ff6ce8" />
            </linearGradient>

            <linearGradient
              id="SVGU4sKxbEp"
              x1="5.565"
              x2="12.316"
              y1=".507"
              y2="12.725"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#6ce0ff" />
              <stop offset=".462" stop-color="#29c3ff" />
              <stop offset="1" stop-color="#4894fe" />
            </linearGradient>
          </defs>
        </g>
      </svg>
    </span>
  `;
};

const user = await getMe();

console.log("CURRENT USER:", user);

const messageNotificationList = document.querySelector(
  "#messageNotificationList",
);
const allNotificationsList = document.querySelector(
  "#all-notifications-list",
);

  const createNotificationHTML = (notif) => {
  const senderImage =
    notif.type === "SYSTEM"
      ? "/images/default-profile.png"
      : `${base_URL}/users/profile-image/${notif.sender._id}`;

  const senderRole =
    notif.type === "SYSTEM"
      ? "System"
      : roleLabels[notif.sender.role] || notif.sender.role;

  return `
    <div
      data-notification-id="${notif._id}"
      class="notification-item flex items-start gap-3 border-b border-slate-100 px-4 py-4 dark:border-white/5 ${
        !notif.isRead
          ? "bg-indigo-50 dark:bg-indigo-500/10"
          : ""
      }"
    >
      <img
        src="${senderImage}"
        alt="${notif.sender?.username || "System"}"
        class="h-10 w-10 shrink-0 rounded-xl object-cover"
      />

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <p class="text-sm font-semibold text-slate-800 dark:text-white">
            ${notif.sender?.username || "System"}
          </p>

          <span class="shrink-0 text-[11px] text-slate-400">
            ${new Date(notif.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          ${notif.message}
        </p>

        <p class="mt-1 text-[10px] font-semibold text-indigo-500 dark:text-indigo-400">
          ${senderRole}
        </p>
      </div>

      ${getNotificationStatusIcon(notif.isRead)}
    </div>
  `;
};
const updateUnreadNotificationCount = () => {
  const unreadCount = userNotifs.filter(
    (notif) => !notif.isRead,
  ).length;



  const unreadMessageCount = document.querySelector(
    "#unread-message-count",
  );

  if (!unreadMessageCount) return;

  if (unreadCount > 0) {
    unreadMessageCount.textContent = unreadCount;
    unreadMessageCount.classList.remove("hidden");
  } else {
    unreadMessageCount.classList.add("hidden");
  }
};
const loadNotifs = await getAndShowAllMessages();
const userNotifs = loadNotifs?.notifications;
if (userNotifs) {
  messageNotificationList.innerHTML = "";
  allNotificationsList.innerHTML = "";

  updateUnreadNotificationCount();

  const compactNotifications = userNotifs.slice(0, 3);
  const expandedNotifications = userNotifs;

  compactNotifications.forEach((notif) => {
    messageNotificationList.insertAdjacentHTML(
      "beforeend",
      createNotificationHTML(notif),
    );
  });

  expandedNotifications.forEach((notif) => {
    allNotificationsList.insertAdjacentHTML(
      "beforeend",
      createNotificationHTML(notif),
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

// user-modal
const userProfile = document.querySelector("#user-profile");
const userMenu = document.querySelector("#user-menu");
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
userMenu.classList.add("hidden");
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
  messageNotificationModal.classList.replace("compact", "expanded");
  showExpandedView();
};

const collapseNotificationModal = () => {
  messageNotificationModal.classList.replace("expanded", "compact");
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


// User-Profile Modal


if (userProfile && userMenu) {
 userProfile.addEventListener("click", (event) => {
  event.stopPropagation();

  closeNotificationModal();

  userMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    if (!userMenu.contains(event.target) && !userProfile.contains(event.target)) {
      userMenu.classList.add("hidden");
    }
  });
}


// detailed-notification-modal


const notificationDetailTitle = document.querySelector(
  "#notification-detail-title",
);

const notificationDetailImage = document.querySelector(
  "#notification-detail-image",
);

const notificationDetailSender = document.querySelector(
  "#notification-detail-sender",
);

const notificationDetailMessage = document.querySelector(
  "#notification-detail-message",
);

const notificationDetailTime = document.querySelector(
  "#notification-detail-time",
);
