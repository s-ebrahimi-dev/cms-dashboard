import { base_URL } from "../../config.js";
import { loadComponent } from "../../components/component-Loader.js";
import {
  getAllUser,
  openCreateAppointmentModal,
  closeCreateAppointmentModal,
} from "../../funcs/shared.js";
await loadComponent(
  "appointment-modal",
  "/Components/receptionist/create-appointment-modal.html",
);
const newAppointmentButton = document.querySelector("#new-appointment-button");
const quickNewAppointmentButton = document.querySelector(
  "#quick-new-appointment",
);
const closeCreateAppointmentModalBtn = document.querySelector(
  "#close-create-appointment-modal",
);
const cancelCreateAppointmentModalBtn = document.querySelector(
  "#cancel-create-appointment",
);

newAppointmentButton.addEventListener("click", openCreateAppointmentModal);
quickNewAppointmentButton.addEventListener("click", openCreateAppointmentModal);

closeCreateAppointmentModalBtn.addEventListener(
  "click",
  closeCreateAppointmentModal,
);
cancelCreateAppointmentModalBtn.addEventListener(
  "click",
  closeCreateAppointmentModal,
);

// create appointment modal
const existingCustomerMode = document.querySelector("#existing-customer-mode");
const newCustomerMode = document.querySelector("#new-customer-mode");

const existingCustomerPanel = document.querySelector(
  "#existing-customer-panel",
);
const newCustomerPanel = document.querySelector("#new-customer-panel");

// Change "Existing and New Customer's Button" state
const setCustomerMode = (mode) => {
  const isExistingCustomer = mode === "existing";

  existingCustomerPanel.classList.toggle("hidden", !isExistingCustomer);
  newCustomerPanel.classList.toggle("hidden", isExistingCustomer);

  const indicator = document.querySelector("#customer-mode-indicator");

  // Move the sliding background
  indicator.classList.toggle("translate-x-full", !isExistingCustomer);

  // Update button accessibility states
  existingCustomerMode.setAttribute("aria-pressed", String(isExistingCustomer));

  newCustomerMode.setAttribute("aria-pressed", String(!isExistingCustomer));

  // Update the active and inactive text styles
  existingCustomerMode.classList.toggle("font-semibold", isExistingCustomer);
  existingCustomerMode.classList.toggle("font-medium", !isExistingCustomer);

  newCustomerMode.classList.toggle("font-semibold", !isExistingCustomer);
  newCustomerMode.classList.toggle("font-medium", isExistingCustomer);

  existingCustomerMode.classList.toggle("text-gray-900", isExistingCustomer);
  existingCustomerMode.classList.toggle("text-gray-600", !isExistingCustomer);

  newCustomerMode.classList.toggle("text-gray-900", !isExistingCustomer);
  newCustomerMode.classList.toggle("text-gray-600", isExistingCustomer);

  existingCustomerMode.classList.toggle("dark:text-white", isExistingCustomer);
  existingCustomerMode.classList.toggle(
    "dark:text-zinc-400",
    !isExistingCustomer,
  );

  newCustomerMode.classList.toggle("dark:text-white", !isExistingCustomer);
  newCustomerMode.classList.toggle("dark:text-zinc-400", isExistingCustomer);
};

existingCustomerMode.addEventListener("click", () => {
  setCustomerMode("existing");
});

newCustomerMode.addEventListener("click", () => {
  setCustomerMode("new");
});

// Get All Users And Find

const users = await getAllUser();
const customers = users.filter((user) => {
  return user.role === "CUSTOMER";
});

const resultSearchBox = document.querySelector("#appointment-customer-results");
const serachExistingCustomerInputElem = document.querySelector(
  "#appointment-customer-search",
);
serachExistingCustomerInputElem.addEventListener("input", (event) => {
  const searchValue = event.target.value.trim().toLowerCase();
  if (!searchValue) {
    resultSearchBox.classList.add("hidden");
    resultSearchBox.classList.remove("flex");
    return;
  }
  resultSearchBox.classList.remove("hidden");
  resultSearchBox.classList.add("flex");
  const foundedCustomer = customers.filter((customer) => {
    return customer.firstname.toLowerCase().startsWith(searchValue);
  });
  resultSearchBox.innerHTML = "";

  foundedCustomer.forEach((customer) => {
    const customerResult = document.createElement("button");

    customerResult.type = "button";
    customerResult.className =
      "customer group flex w-full items-center gap-3 border-b border-gray-100 " +
      "px-4 py-3 text-left cursor-default sm:cursor-pointer transition-colors duration-200 " +
      "last:border-b-0 hover:bg-indigo-50/70 " +
      "focus-visible:bg-indigo-50 focus-visible:outline-none " +
      "dark:border-zinc-700 dark:hover:bg-zinc-700/60 " +
      "dark:focus-visible:bg-zinc-700";

    const avatar = document.createElement("div");

    avatar.className =
      "size-11 shrink-0 overflow-hidden rounded-full " +
      "bg-indigo-100 dark:bg-indigo-500/20";

    const avatarImage = document.createElement("img");

    avatarImage.className = "size-full object-cover";

    avatarImage.alt = `${customer.firstname} ${customer.lastname}`;

    avatarImage.onerror = () => {
      const avatarFallback = document.createElement("div");

      avatarFallback.className =
        "flex size-full items-center justify-center " +
        "text-sm font-semibold text-indigo-700 " +
        "dark:text-indigo-300";

      avatarFallback.textContent =
        `${customer.firstname?.[0] ?? ""}${customer.lastname?.[0] ?? ""}`.toUpperCase();

      avatar.replaceChildren(avatarFallback);
    };

    avatarImage.src = `${base_URL}/users/profile-image/${customer._id}`;

    avatar.append(avatarImage);

    const customerInfo = document.createElement("div");
    customerInfo.className = "min-w-0 flex-1";

    const fullName = document.createElement("p");
    fullName.className =
      "truncate text-sm font-semibold text-gray-900 " + "dark:text-zinc-100";
    fullName.textContent =
      `${customer.firstname ?? ""} ${customer.lastname ?? ""}`.trim();

    const username = document.createElement("p");
    username.className =
      "mt-0.5 truncate text-xs text-gray-500 dark:text-zinc-400";
    username.textContent = `@${customer.username ?? ""}`;

    const contact = document.createElement("p");
    contact.className =
      "mt-1 truncate text-xs text-gray-500 dark:text-zinc-400";
    contact.textContent =
      customer.email || customer.phone || "No contact information";

    customerInfo.append(fullName, username, contact);

    const arrow = document.createElement("span");
    arrow.className =
      "shrink-0 text-gray-400 transition-transform " +
      "group-hover:translate-x-0.5 group-hover:text-indigo-600 " +
      "dark:group-hover:text-indigo-400";
    arrow.textContent = "›";

    customerResult.append(avatar, customerInfo, arrow);
    resultSearchBox.append(customerResult);
  });
});

resultSearchBox.addEventListener("click", async (event) => {
  const customerBtn = event.target.closest(".customer");

  if (!customerBtn || !resultSearchBox.contains(customerBtn)) {
    return;
  }

  console.log("Customer clicked:", customerBtn);

  await loadComponent(
    "customer-detail-infos",
    "/Components/receptionist/customer-detail-information.html",
  );

  const customerDetailModal = document.querySelector("#customer-details-modal");

  if (!customerDetailModal) {
    console.error("Customer details modal was not loaded.");
    return;
  }

  customerDetailModal.classList.remove("hidden");
  customerDetailModal.classList.add("flex");
  const closeCustomerDetailModalBtn = document.querySelector(
    "#close-customer-details",
  );
  const cancelCustomerDetailModalBtn = document.querySelector(
    "#cancel-customer-details",
  );

  closeCustomerDetailModalBtn.addEventListener("click", () => {
    customerDetailModal.classList.add("hidden");
    customerDetailModal.classList.remove("flex");
  });
  cancelCustomerDetailModalBtn.addEventListener("click", () => {
    customerDetailModal.classList.add("hidden");
    customerDetailModal.classList.remove("flex");
  });
});
