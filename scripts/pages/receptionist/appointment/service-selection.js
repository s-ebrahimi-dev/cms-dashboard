import { base_URL } from "../../../config.js";

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (remainingMinutes === 0) return `${hours} hours`;

  return `${hours}h ${remainingMinutes}m`;
};

const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

export async function initializeServiceSelection() {
  const serviceSelect = document.querySelector("#appointment-service");
  const serviceDetails = document.querySelector("#appointment-service-details");
  const serviceDuration = document.querySelector(
    "#appointment-service-duration",
  );
  const servicePrice = document.querySelector("#appointment-service-price");

  if (!serviceSelect || !serviceDetails || !serviceDuration || !servicePrice) {
    console.error("Service selection elements were not found.");
    return;
  }

  const servicesById = new Map();

  const hideServiceDetails = () => {
    serviceDetails.classList.add("hidden");
    serviceDetails.classList.remove("grid");
    serviceDuration.textContent = "—";
    servicePrice.textContent = "—";
  };

  const handleServiceChange = () => {
    const service = servicesById.get(serviceSelect.value);

    if (!service) {
      hideServiceDetails();
      return;
    }

    serviceDuration.textContent = formatDuration(
      service.estimatedDurationMinutes,
    );

    servicePrice.textContent = formatPrice(service.basePrice);

    serviceDetails.classList.remove("hidden");
    serviceDetails.classList.add("grid");
  };

  try {
    const response = await fetch(`${base_URL}/services/`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch services.");
    }

    // Adjust this to match your actual controller response.
    const services = result.data;

    if (!Array.isArray(services)) {
      throw new Error("The services response is not an array.");
    }

    const activeServices = services;

    serviceSelect.replaceChildren(new Option("Select a service", ""));

    servicesById.clear();

    activeServices.forEach((service) => {
      servicesById.set(service._id, service);

      serviceSelect.add(new Option(service.name, service._id));
    });

    serviceSelect.removeEventListener("change", handleServiceChange);
    serviceSelect.addEventListener("change", handleServiceChange);

    hideServiceDetails();
  } catch (error) {
    console.error("Error initializing service selection:", error);
  }
}
