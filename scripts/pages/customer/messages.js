import {
  openNewConversationModal,
  createNewConversation,
  sendConversationMessage,
  closeNewConversationModal,
  getAndShowAllConversations,
  getAndShowAllEmployees,
} from "../../funcs/shared.js";
import { showResultModal } from "../../components/result-modal.js";
import { loadComponent } from "../../components/component-Loader.js";
import { hideLoader, showLoader } from "../../funcs/loader.js";

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
// Show New Conversation Modal
const newConversationModal = document.querySelector(
  "#new-conversation-container",
);
if (newConversationModal) {
  await loadComponent(
    "new-conversation-container",
    "/Components/new-conversation-modal.html",
  );
}
await getAndShowAllEmployees();
await getAndShowAllConversations();

const newMessageBtn = document.querySelector("#new-message-button");
newMessageBtn.addEventListener("click", (event) => {
  event.preventDefault();
  openNewConversationModal();
});

const conversationMessageElem = document.querySelector("#conversation-message");

const closeConversationModalBtn = document.querySelector(
  "#close-new-conversation",
);

closeConversationModalBtn.addEventListener("click", () => {
  closeNewConversationModal();
  conversationMessageElem.value = "";
});
const cancelConversationModal = document.querySelector(
  "#cancel-new-conversation",
);
cancelConversationModal.addEventListener("click", () => {
  closeNewConversationModal();
  conversationMessageElem.value = "";
});

// Create Employees
let selectedEmployeeId = null;

const newConversationEmployeesElem = document.querySelector(
  "#conversation-employee",
);

// Select Employees
const changeEmployeeBtn = document.querySelector(
  "#change-conversation-employee",
);
newConversationEmployeesElem.addEventListener("click", (event) => {
  const option = event.target.closest(".conversation-employee-option");

  if (!option) return;

  selectedEmployeeId = option.dataset.userId;

  newConversationEmployeesElem
    .querySelectorAll(".conversation-employee-option")
    .forEach((item) => {
      if (item !== option) {
        item.classList.add("hidden");
      }
    });

  option.classList.remove("border-slate-200");
  option.classList.remove("bg-white");
  option.classList.remove("dark:border-white/10");
  option.classList.remove("dark:bg-[#1D2630]");
  option.classList.add("bg-indigo-50");
  option.classList.add("border-indigo-500");
  option.classList.add("dark:bg-indigo-500/10");
  option.classList.add("dark:border-indigo-400");
  changeEmployeeBtn.classList.remove("hidden");
});

changeEmployeeBtn.addEventListener("click", () => {
  newConversationEmployeesElem
    .querySelectorAll(".conversation-employee-option")
    .forEach((item) => {
      item.classList.remove(
        "hidden",
        "bg-indigo-50",
        "border-indigo-500",
        "dark:bg-indigo-500/10",
        "dark:border-indigo-400",
      );

      item.classList.add(
        "border-slate-200",
        "bg-white",
        "dark:border-white/10",
        "dark:bg-[#1D2630]",
      );
    });

  changeEmployeeBtn.classList.add("hidden");

  selectedEmployeeId = null;
});

// Create New Conversation
const sendNewConversationBtn = document.querySelector(
  "#submit-new-conversation",
);

sendNewConversationBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  closeNewConversationModal();

  const message = conversationMessageElem.value.trim();

  if (!selectedEmployeeId) {
    return;
  }

  if (!message) {
    return;
  }

  showLoader();

  // 1. Create conversation
  const conversationResult = await createNewConversation(selectedEmployeeId);

  const conversation = conversationResult.data;

  // 2. Send the first message
  const messageResult = await sendConversationMessage(
    conversation._id,
    message,
  );

  if (messageResult.data) {
    await getAndShowAllConversations();

    hideLoader();

    showResultModal("success", "Message sent successfully.");
    return;
  }

  hideLoader();

  showResultModal("error", messageResult.message || "Failed to send message");
  conversationMessageElem.value = "";
});
