import { loadComponent } from "../../components/component-Loader.js";

import {
  openCreateAppointmentModal,
  closeCreateAppointmentModal,
} from "../../funcs/shared.js";

import {
  initializeCustomerSelection,
  resetCustomerSelection,
  getSelectedCustomer,
  isCustomerReady,
} from "./appointment/customer-selection.js";

import {
  initializeVehicleSelection,
  isVehicleReady,
} from "./appointment/vehicle-selection.js";

import { initializeVehicleColorDropdown } from "./appointment/vehicle-color-dropdown.js";
import { initializeServiceSelection } from "./appointment/service-selection.js";
import { initializeAvailability } from "./appointment/availability.js";

await loadComponent(
  "appointment-modal",
  "/Components/receptionist/create-appointment-modal.html",
);

// Modal elements
const appointmentForm = document.querySelector(
  "#create-appointment-form"
);

const submitButton = document.querySelector(
  "#create-appointment-submit"
);

const serviceSelect = document.querySelector(
  "#appointment-service"
);

const timeSlotSelect = document.querySelector(
  "#appointment-time-slot"
);

// Create Appointment Vehicle

async function createAppointmentVehicle(customerId) {
  const vehicleData = {
    customer: customerId,
    make: document.querySelector("#new-vehicle-make").value,
    model: document.querySelector("#new-vehicle-model").value,
    year: Number(document.querySelector("#new-vehicle-year").value),
    licensePlate: document
      .querySelector("#new-vehicle-license-plate")
      .value.trim(),
    vin: document.querySelector("#new-vehicle-vin").value.trim(),
    mileage: Number(
      document.querySelector("#new-vehicle-mileage").value
    ),
    color: document.querySelector("#new-vehicle-color").value,
  };

  const response = await fetch(`${base_URL}/vehicles`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create vehicle.");
  }

  return result.data._id;
}


// Update the submit button according to the current form state.
function updateAppointmentSubmitState() {
  if (!submitButton) return;

  const customerReady = isCustomerReady();
  const vehicleReady = isVehicleReady();
  const serviceReady = Boolean(serviceSelect?.value);
  const slotReady =
    Boolean(timeSlotSelect?.value) &&
    !timeSlotSelect?.disabled;

  submitButton.disabled = !(
    customerReady &&
    vehicleReady &&
    serviceReady &&
    slotReady
  );
}

// Listen for customer and vehicle selection changes.
document.addEventListener(
  "appointment:customer-changed",
  updateAppointmentSubmitState
);

document.addEventListener(
  "appointment:vehicle-changed",
  updateAppointmentSubmitState
);

// Listen for changes and typing in the appointment form.
appointmentForm?.addEventListener(
  "change",
  updateAppointmentSubmitState
);

appointmentForm?.addEventListener(
  "input",
  updateAppointmentSubmitState
);

// Initialize the appointment features once.
initializeServiceSelection();
initializeAvailability();

initializeCustomerSelection();
initializeVehicleSelection();
initializeVehicleColorDropdown();

// Modal controls
const newAppointmentButton = document.querySelector(
  "#new-appointment-button"
);

const quickNewAppointmentButton = document.querySelector(
  "#quick-new-appointment"
);

const closeCreateAppointmentModalBtn = document.querySelector(
  "#close-create-appointment-modal"
);

const cancelCreateAppointmentModalBtn = document.querySelector(
  "#cancel-create-appointment"
);

newAppointmentButton?.addEventListener(
  "click",
  openCreateAppointmentModal
);

quickNewAppointmentButton?.addEventListener(
  "click",
  openCreateAppointmentModal
);

const closeAppointment = () => {
  closeCreateAppointmentModal();
  resetCustomerSelection();

  // Prevent a previous selection from enabling a new appointment.
  updateAppointmentSubmitState();
};

closeCreateAppointmentModalBtn?.addEventListener(
  "click",
  closeAppointment
);

cancelCreateAppointmentModalBtn?.addEventListener(
  "click",
  closeAppointment
);

// Set the correct initial state.
updateAppointmentSubmitState();