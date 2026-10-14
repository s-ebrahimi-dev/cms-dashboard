import { loadComponent } from "../../components/component-Loader.js";
import { base_URL } from "../../config.js";
import {
  openCreateAppointmentModal,
  closeCreateAppointmentModal,
} from "../../funcs/shared.js";
import { showResultModal } from "../../components/result-modal.js";
import {
  initializeCustomerSelection,
  resetCustomerSelection,
  getSelectedCustomer,
  isCustomerReady,
} from "./appointment/customer-selection.js";
import { showLoader, hideLoader } from "../../funcs/loader.js";
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


const appointmentError = document.querySelector("#create-appointment-error");

function showAppointmentMessage(message, type = "error") {
  if (!appointmentError) {
    console.error(message);
    return;
  }

  appointmentError.textContent = message;
  appointmentError.classList.remove("hidden", "text-red-500", "text-green-600");

  appointmentError.classList.add(
    type === "success" ? "text-green-600" : "text-red-500",
  );
}

function clearAppointmentMessage() {
  if (!appointmentError) return;

  appointmentError.textContent = "";
  appointmentError.classList.add("hidden");
  appointmentError.classList.remove("text-red-500", "text-green-600");
}

async function readResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
}

async function createAppointmentCustomer() {
  const customerData = {
    firstname: document.querySelector("#new-customer-firstname").value.trim(),
    lastname: document.querySelector("#new-customer-lastname").value.trim(),
    phone: document.querySelector("#new-customer-phone").value.trim(),
    email:
      document.querySelector("#new-customer-email").value.trim() || undefined,
    username: document.querySelector("#new-customer-username").value.trim(),
    password: document.querySelector("#new-customer-password").value,
  };

  const response = await fetch(`${base_URL}/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });

  const result = await readResponse(
    response,
    "Failed to create the customer.",
  );

  if (!result.data?._id) {
    throw new Error("Customer was created, but the server returned no ID.");
  }

  return result.data._id;
}

async function submitAppointment(event) {
  event.preventDefault();
  clearAppointmentMessage();

  // 1. Prevent duplicate submissions.
  if (submitButton.disabled) {
    return;
  }

  // 2. Validate the form.
  if (!appointmentForm.checkValidity()) {
    appointmentForm.reportValidity();
    return;
  }

  // 3. Determine the selected customer and vehicle modes.
  const isNewCustomer =
    document.querySelector("#new-customer-mode")?.getAttribute("aria-pressed") ===
    "true";

  const isNewVehicle =
    document.querySelector("#new-vehicle-mode")?.getAttribute("aria-pressed") ===
    "true";

  const selectedCustomer = getSelectedCustomer();

  // 4. Validate customer selection.
  if (isNewCustomer && !isNewVehicle) {
    showAppointmentMessage(
      "Please select New Vehicle when registering a new customer.",
    );
    return;
  }

  if (!isNewCustomer && !selectedCustomer?._id) {
    showAppointmentMessage("Please select an existing customer.");
    return;
  }

  // 5. Validate vehicle, service, and appointment time.
  if (!isVehicleReady()) {
    showAppointmentMessage("Please select or enter the vehicle details.");
    return;
  }

  if (!serviceSelect?.value) {
    showAppointmentMessage("Please select a service.");
    return;
  }

  if (!timeSlotSelect?.value || timeSlotSelect.disabled) {
    showAppointmentMessage("Please select an available appointment time.");
    return;
  }

  // 6. Disable the button while processing.
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Creating appointment...";

  try {
    // 7. Get or create the customer.
    const customerId = isNewCustomer
      ? await createAppointmentCustomer()
      : selectedCustomer._id;

    // 8. Get or create the vehicle.
    const vehicleSelect = document.querySelector("#appointment-vehicle");

    const vehicleId = isNewVehicle
      ? await createAppointmentVehicle(customerId)
      : vehicleSelect?.value;

    if (!vehicleId) {
      throw new Error("Please select a vehicle.");
    }

    // 9. Prepare the appointment data.
    const appointmentData = {
      customer: customerId,
      vehicle: vehicleId,
      service: serviceSelect.value,
      scheduledAt: timeSlotSelect.value,
      notes:
        document.querySelector("#appointment-notes")?.value.trim() || "",
    };

    // 10. Show the loader and send the appointment request.
    showLoader(
      "Creating appointment...",
      "Please wait while we save your appointment.",
    );

    let result;

    try {
      const response = await fetch(`${base_URL}/appointments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      result = await readResponse(
        response,
        "Failed to create the appointment.",
      );
    } finally {
      // Always hide the loader, including when the request fails.
      hideLoader();
    }

    // 11. Show success only after the request succeeds.
    showResultModal(
      "success",
      result.message || "Appointment created successfully!",
    );

    // 12. Reset the form once, after successful creation.
    appointmentForm.reset();
    resetCustomerSelection();

    // 13. Notify dependent modules that the form state has changed.
    document.dispatchEvent(new Event("appointment:vehicle-changed"));
    document.dispatchEvent(new Event("appointment:customer-changed"));

  } catch (error) {
    // 14. Handle errors from customer, vehicle, or appointment creation.
    console.error("CREATE APPOINTMENT ERROR:", error);

    showResultModal(
      "error",
      error.message || "Failed to create the appointment.",
    );

  } finally {
    // 15. Restore the button regardless of success or failure.
    submitButton.textContent = originalButtonText;
    updateAppointmentSubmitState();
  }
}

appointmentForm?.addEventListener("submit", submitAppointment);


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