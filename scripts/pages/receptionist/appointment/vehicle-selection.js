
export function initializeVehicleSelection() {
  const existingVehicleMode = document.querySelector("#existing-vehicle-mode");
  const newVehicleMode = document.querySelector("#new-vehicle-mode");
  const vehicleModeIndicator = document.querySelector("#vehicle-mode-indicator");

  const existingVehiclePanel = document.querySelector("#existing-vehicle-panel");
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



function notifyVehicleSelectionChanged() {
  document.dispatchEvent(
    new CustomEvent("appointment:vehicle-changed")
  );
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

 export  function isVehicleReady() {
  const existingMode = document.querySelector("#existing-vehicle-mode");
  const newPanel = document.querySelector("#new-vehicle-panel");
  const vehicleSelect = document.querySelector("#appointment-vehicle");

  if (!existingMode || !newPanel || !vehicleSelect) {
    return false;
  }

  const isExistingMode =
    existingMode.getAttribute("aria-pressed") === "true";

  if (isExistingMode) {
    return Boolean(vehicleSelect.value);
  }

  const requiredFields = [
    ...newPanel.querySelectorAll(
      "input[required], select[required], textarea[required]"
    ),
  ];

  return (
    requiredFields.length > 0 &&
    requiredFields.every((field) => field.checkValidity())
  );
}