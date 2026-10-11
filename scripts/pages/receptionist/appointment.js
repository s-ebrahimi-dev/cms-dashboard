import { loadComponent } from "../../components/component-Loader.js";
import { openCreateAppointmentModal, closeCreateAppointmentModal } from "../../funcs/shared.js";
await loadComponent(
    "appointment-modal",
    "/Components/receptionist/create-appointment-modal.html"
)
const newAppointmentButton = document.querySelector("#new-appointment-button")
const quickNewAppointmentButton = document.querySelector("#quick-new-appointment")
const closeCreateAppointmentModalBtn = document.querySelector("#close-create-appointment-modal");
const cancelCreateAppointmentModalBtn = document.querySelector("#cancel-create-appointment")

newAppointmentButton.addEventListener("click", openCreateAppointmentModal)
quickNewAppointmentButton.addEventListener("click", openCreateAppointmentModal)

closeCreateAppointmentModalBtn.addEventListener("click", closeCreateAppointmentModal)
cancelCreateAppointmentModalBtn.addEventListener("click", closeCreateAppointmentModal)

// create appointment modal
const existingCustomerMode = document.querySelector("#existing-customer-mode");
const newCustomerMode = document.querySelector("#new-customer-mode");

const existingCustomerPanel = document.querySelector("#existing-customer-panel");
const newCustomerPanel = document.querySelector("#new-customer-panel");

// Change "Existing and New Customer's Button state"
const setCustomerMode = (mode) => {
  const isExistingCustomer = mode === "existing";

  existingCustomerPanel.classList.toggle("hidden", !isExistingCustomer);
  newCustomerPanel.classList.toggle("hidden", isExistingCustomer);

  const indicator = document.querySelector("#customer-mode-indicator");

  // Move the sliding background
  indicator.classList.toggle("translate-x-full", !isExistingCustomer);

  // Update button accessibility states
  existingCustomerMode.setAttribute(
    "aria-pressed",
    String(isExistingCustomer),
  );

  newCustomerMode.setAttribute(
    "aria-pressed",
    String(!isExistingCustomer),
  );

  // Update the active and inactive text styles
  existingCustomerMode.classList.toggle(
    "font-semibold",
    isExistingCustomer,
  );
  existingCustomerMode.classList.toggle(
    "font-medium",
    !isExistingCustomer,
  );

  newCustomerMode.classList.toggle(
    "font-semibold",
    !isExistingCustomer,
  );
  newCustomerMode.classList.toggle(
    "font-medium",
    isExistingCustomer,
  );

  existingCustomerMode.classList.toggle(
    "text-gray-900",
    isExistingCustomer,
  );
  existingCustomerMode.classList.toggle(
    "text-gray-600",
    !isExistingCustomer,
  );

  newCustomerMode.classList.toggle(
    "text-gray-900",
    !isExistingCustomer,
  );
  newCustomerMode.classList.toggle(
    "text-gray-600",
    isExistingCustomer,
  );

  existingCustomerMode.classList.toggle(
    "dark:text-white",
    isExistingCustomer,
  );
  existingCustomerMode.classList.toggle(
    "dark:text-zinc-400",
    !isExistingCustomer,
  );

  newCustomerMode.classList.toggle(
    "dark:text-white",
    !isExistingCustomer,
  );
  newCustomerMode.classList.toggle(
    "dark:text-zinc-400",
    isExistingCustomer,
  );
};

existingCustomerMode.addEventListener("click", () => {
  setCustomerMode("existing");
});

newCustomerMode.addEventListener("click", () => {
  setCustomerMode("new");
});