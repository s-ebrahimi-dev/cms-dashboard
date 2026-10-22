import { base_URL } from "../../../config.js";
export function initializeVehicleSelection() {
  const existingVehicleMode = document.querySelector("#existing-vehicle-mode");
  const newVehicleMode = document.querySelector("#new-vehicle-mode");
  const vehicleModeIndicator = document.querySelector(
    "#vehicle-mode-indicator",
  );

  const existingVehiclePanel = document.querySelector(
    "#existing-vehicle-panel",
  );
  const newVehiclePanel = document.querySelector("#new-vehicle-panel");

  const vehicleSelect = document.querySelector("#appointment-vehicle");
  const vehicleDetails = document.querySelector("#appointment-vehicle-details");
  const registerVehicleFromEmpty = document.querySelector(
    "#register-vehicle-from-empty",
  );
  const newVehicleError = document.querySelector("#new-vehicle-error");

  if (
    !existingVehicleMode ||
    !newVehicleMode ||
    !vehicleModeIndicator ||
    !existingVehiclePanel ||
    !newVehiclePanel ||
    !vehicleSelect ||
    !vehicleDetails ||
    !newVehicleError
  ) {
    console.error("Vehicle selection elements were not found.");
    return;
  }

  let latestVehicleRequest = 0;

  function clearVehicleSelection(message = "Select a vehicle") {
    vehicleSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = message;

    vehicleSelect.append(placeholder);
    vehicleSelect.value = "";

    vehicleDetails.classList.add("hidden");
    notifyVehicleSelectionChanged();
  }


async function loadCustomerVehicles() {
  const requestId = ++latestVehicleRequest;

  const customerId = document.querySelector(
    "#selected-appointment-customer",
  )?.dataset.customerId;

  const isExistingMode =
    existingVehicleMode.getAttribute("aria-pressed") === "true";

  clearVehicleSelection(
    !isExistingMode
      ? "Switch to Existing Vehicle to select a vehicle"
      : customerId
        ? "Loading vehicles..."
        : "Select a customer first",
  );

  // Do not fetch vehicles in New Vehicle mode or without a customer.
  if (!isExistingMode || !customerId) return;

  try {
    const response = await fetch(
      `${base_URL}/vehicles?customerId=${encodeURIComponent(customerId)}`,
      { credentials: "include" },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to load vehicles.");
    }

    // Ignore an outdated request.
    if (requestId !== latestVehicleRequest) return;

    const vehicles = result.data;

    if (!Array.isArray(vehicles)) {
      throw new Error("Invalid vehicles response from the server.");
    }

    vehicleSelect.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = vehicles.length
      ? "Select a vehicle"
      : "No vehicles registered";

    vehicleSelect.append(placeholder);

    for (const vehicle of vehicles) {
      const option = document.createElement("option");

      option.value = vehicle._id;
      option.textContent =
        `${vehicle.make} ${vehicle.model} (${vehicle.year}) — ` +
        `${vehicle.licensePlate}`;

      vehicleSelect.append(option);
    }

    vehicleDetails.classList.add("hidden");
    notifyVehicleSelectionChanged();
  } catch (error) {
    if (requestId !== latestVehicleRequest) return;

    console.error("Failed to load customer vehicles:", error);
    clearVehicleSelection("Failed to load vehicles");
  }
}


  document.addEventListener(
    "appointment:customer-changed",
    loadCustomerVehicles,
  );

  function notifyVehicleSelectionChanged() {
    document.dispatchEvent(new CustomEvent("appointment:vehicle-changed"));
  }

  function setVehicleMode(mode) {
    const isExisting = mode === "existing";

    existingVehiclePanel.disabled = !isExisting;
    newVehiclePanel.disabled = isExisting;

    existingVehiclePanel.classList.toggle("hidden", !isExisting);
    newVehiclePanel.classList.toggle("hidden", isExisting);

    vehicleModeIndicator.classList.toggle("-translate-x-0", isExisting);
    vehicleModeIndicator.classList.toggle("translate-x-full", !isExisting);

    existingVehicleMode.setAttribute("aria-pressed", String(isExisting));
    newVehicleMode.setAttribute("aria-pressed", String(!isExisting));

    existingVehicleMode.classList.toggle("font-semibold", isExisting);
    existingVehicleMode.classList.toggle("font-medium", !isExisting);
    existingVehicleMode.classList.toggle("text-gray-900", isExisting);
    existingVehicleMode.classList.toggle("text-gray-600", !isExisting);
    existingVehicleMode.classList.toggle("dark:text-white", isExisting);
    existingVehicleMode.classList.toggle("dark:text-zinc-400", !isExisting);

    newVehicleMode.classList.toggle("font-semibold", !isExisting);
    newVehicleMode.classList.toggle("font-medium", isExisting);
    newVehicleMode.classList.toggle("text-gray-900", !isExisting);
    newVehicleMode.classList.toggle("text-gray-600", isExisting);
    newVehicleMode.classList.toggle("dark:text-white", !isExisting);
    newVehicleMode.classList.toggle("dark:text-zinc-400", isExisting);

    newVehicleError.classList.add("hidden");
    newVehicleError.textContent = "";

    if (!isExisting) {
      vehicleDetails.classList.add("hidden");
      latestVehicleRequest++;
      clearVehicleSelection("Select a vehicle");
    }
    notifyVehicleSelectionChanged();
  }

  existingVehicleMode.addEventListener("click", () => {
    setVehicleMode("existing");
  });

  newVehicleMode.addEventListener("click", () => {
    setVehicleMode("new");
  });

  registerVehicleFromEmpty?.addEventListener("click", () => {
    setVehicleMode("new");
  });

  vehicleSelect.addEventListener("change", () => {
    vehicleDetails.classList.toggle("hidden", !vehicleSelect.value);
    notifyVehicleSelectionChanged();
  });

  // Initial state
  setVehicleMode("existing");
}

export function isVehicleReady() {
  const existingMode = document.querySelector("#existing-vehicle-mode");
  const newPanel = document.querySelector("#new-vehicle-panel");
  const vehicleSelect = document.querySelector("#appointment-vehicle");

  if (!existingMode || !newPanel || !vehicleSelect) {
    return false;
  }

  const isExistingMode = existingMode.getAttribute("aria-pressed") === "true";

  if (isExistingMode) {
    return Boolean(vehicleSelect.value);
  }

  const requiredFields = [
    ...newPanel.querySelectorAll(
      "input[required], select[required], textarea[required]",
    ),
  ];

  return (
    requiredFields.length > 0 &&
    requiredFields.every((field) => field.checkValidity())
  );
}
export const getCustomerVehicles = async (customerId) => {
  const response = await fetch(
    `/api/vehicles?customerId=${customerId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch customer vehicles.");
  }

  const result = await response.json();

  return result.data;
};