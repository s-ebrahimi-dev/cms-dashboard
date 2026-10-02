import {openNewConversationModal, closeNewConversationModal, getAndShowAllConversations,getAndShowAllEmployees } from "../../funcs/shared.js";
import { loadComponent } from "../../components/component-Loader.js";

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
const newConversationModal = document.querySelector("#new-conversation-container")
if (newConversationModal) {
    await loadComponent("new-conversation-container", "/Components/new-conversation-modal.html")
}
const result = await getAndShowAllConversations()
   console.log(result);
   
const newMessageBtn = document.querySelector("#new-message-button")
newMessageBtn.addEventListener("click", (event) => {
    event.preventDefault()
    openNewConversationModal()
})

const closeConversationModalBtn = document.querySelector("#close-new-conversation")

closeConversationModalBtn.addEventListener("click", () => {
    closeNewConversationModal()
})
const cancelConversationModal = document.querySelector("#cancel-new-conversation")
cancelConversationModal.addEventListener("click", () => {
    closeNewConversationModal()
})

// Create Employees
let selectedEmployeeId = null;

const users = await getAndShowAllEmployees()
const newConversationEmployeesElem = document.querySelector("#conversation-employee")
newConversationEmployeesElem.innerHTML = ""
users.data.filter((user) => {
  return (user.role!== "ADMIN" && user.role!== "CUSTOMER")
}).forEach((user) => {
  
    const imageUrl = user.hasProfileImage
    ? `${base_URL}/users/profile-image/${user._id}`
    : "/images/default-profile.png";
  newConversationEmployeesElem.insertAdjacentHTML("beforeend", `
       <button
      type="button"
      class="
        conversation-employee-option
        flex w-full shrink-0 items-center gap-3
        rounded-xl border border-slate-200
        bg-white p-3 text-left
        transition
        hover:border-indigo-300
        hover:bg-indigo-50
        dark:border-white/10
        dark:bg-[#1D2630]
        dark:hover:border-indigo-400
        dark:hover:bg-indigo-500/10
      "
      data-user-id="${user._id}"
      data-role="${user.role}"
    >
      <img
        src="${imageUrl}"
        alt="${user.firstname} ${user.lastname}"
        class="h-10 w-10 shrink-0 rounded-full object-cover"
      />

      <div class="min-w-0">
        <p class="truncate font-medium text-slate-900 dark:text-white">
          ${roleLabels[user.role]}
        </p>

        <p class="truncate text-sm text-slate-500 dark:text-slate-400">
          ${user.firstname} ${user.lastname}
        </p>
      </div>
    </button>
    `)
})


// Select Employees
const changeEmployeeBtn = document.querySelector(
  "#change-conversation-employee"
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
  "dark:border-indigo-400"
);

item.classList.add(
  "border-slate-200",
  "bg-white",
  "dark:border-white/10",
  "dark:bg-[#1D2630]"
);
    });

  changeEmployeeBtn.classList.add("hidden");

  selectedEmployeeId = null;
});