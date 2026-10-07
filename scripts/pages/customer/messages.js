import {
  openNewConversationModal,
  createNewConversation,
  sendConversationMessage,
  closeNewConversationModal,
  getAndShowAllConversations,
  getAndShowAllEmployees,
  initConversationSelection,
  renderSenderMessage,
} from "../../funcs/shared.js";
import { showResultModal } from "../../components/result-modal.js";
import { loadComponent } from "../../components/component-Loader.js";
import { hideLoader, showLoader } from "../../funcs/loader.js";

let selectedConversationId = null;

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

await loadComponent(
  "conversation-loader-container",
  "/Components/loader.html"
);

await loadComponent(
  "thread-loader-container",
  "/Components/loader.html"
);

await getAndShowAllConversations();

initConversationSelection((conversationId) => {
  selectedConversationId = conversationId;

  console.log("Selected conversation:", selectedConversationId);
});


// Render-Sent-Messages 


// Send messages
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message-input");
const sendMessageButton = document.querySelector("#send-message-button");

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  if (!selectedConversationId) {
    showResultModal("error", "Please select a conversation first.");
    return;
  }

  sendMessageButton.disabled = true;

  try {
    const result = await sendConversationMessage(
      selectedConversationId,
      message,
    );

    console.log("SEND MESSAGE RESULT:", result);

    if (!result?.data) {
      showResultModal(
        "error",
        result?.message || "Failed to send message.",
      );
      return;
    }

    messageInput.value = "";

   renderSenderMessage(result.data);
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    showResultModal(
      "error",
      "Something went wrong while sending the message.",
    );
  } finally {
    sendMessageButton.disabled = false;
  }
});

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

  showLoader("Sending message", "please wait...");

  // 1. Create conversation
  const conversationResult =
  await createNewConversation(selectedEmployeeId);

console.log("conversationResult:", conversationResult);

if (!conversationResult?.data?._id) {
  hideLoader();

  showResultModal(
    "error",
    conversationResult?.message || "Failed to create conversation",
  );

  return;
}

const conversation = conversationResult.data;

const messageResult = await sendConversationMessage(
  conversation._id,
  message,
);

  if (messageResult.data) {
    await getAndShowAllConversations();
     initConversationSelection((conversationId) => {
    selectedConversationId = conversationId;

    console.log("Selected conversation:", selectedConversationId);
  });
    hideLoader();

    showResultModal("success", "Message sent successfully.");
    return;
  }

  hideLoader();

  showResultModal("error", messageResult.message || "Failed to send message");
  conversationMessageElem.value = "";
});
