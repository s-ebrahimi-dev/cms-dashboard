
import { loadComponent } from "../../components/component-Loader.js";
import {
  openCreateAppointmentModal,
  closeCreateAppointmentModal,
} from "../../funcs/shared.js";

import { initializeCustomerSelection, resetCustomerSelection } from "./appointment/customer-selection.js";
import { initializeVehicleSelection } from "./appointment/vehicle-selection.js";
import { initializeVehicleColorDropdown } from "./appointment/vehicle-color-dropdown.js";
import {
  initializeServiceSelection,
} from "./appointment/service-selection.js";
import { initializeAvailability } from "./appointment/availability.js";



await loadComponent(
  "appointment-modal",
  "/Components/receptionist/create-appointment-modal.html",
);
initializeServiceSelection();
initializeAvailability();
 initializeServiceSelection();
// Modal controls
const newAppointmentButton = document.querySelector("#new-appointment-button");
const quickNewAppointmentButton = document.querySelector("#quick-new-appointment");
const closeCreateAppointmentModalBtn = document.querySelector("#close-create-appointment-modal");
const cancelCreateAppointmentModalBtn = document.querySelector("#cancel-create-appointment");

newAppointmentButton?.addEventListener("click", openCreateAppointmentModal);
quickNewAppointmentButton?.addEventListener("click", openCreateAppointmentModal);

const closeAppointment = () => {
  closeCreateAppointmentModal();
  resetCustomerSelection();
};

closeCreateAppointmentModalBtn?.addEventListener("click", closeAppointment);
cancelCreateAppointmentModalBtn?.addEventListener("click", closeAppointment);

// Initialize features only after the modal exists in the DOM.
initializeCustomerSelection();
initializeVehicleSelection();
initializeVehicleColorDropdown();

