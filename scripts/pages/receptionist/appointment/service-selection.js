
const testServices = [
  {
    _id: "test-oil-change",
    name: "Oil Change",
    estimatedDurationMinutes: 30,
    basePrice: 45,
  },
  {
    _id: "test-auto-wash",
    name: "Auto Wash",
    estimatedDurationMinutes: 60,
    basePrice: 60,
  },
   {
    _id: "test-detailing-service",
    name: "Detailing",
    estimatedDurationMinutes: 360,
    basePrice: 180,
  },
   {
    _id: "test-body-repair",
    name: "Body Repair",
    estimatedDurationMinutes: 120,
    basePrice: 180,
  },
   {
    _id: "test-mechanical-service",
    name: "Mechanical Service",
    estimatedDurationMinutes: 120,
    basePrice: 180,
  },
  {
    _id: "test-full-service",
    name: "Full Service",
    estimatedDurationMinutes: 120,
    basePrice: 180,
  },
];

let serviceSelect;
let serviceDetails;
let serviceDuration;
let servicePrice;

const servicesById = new Map();

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (remainingMinutes === 0) return `${hours} hours`;

  return `${hours}h ${remainingMinutes}m`;
};

const formatPrice = (price) =>
  `$${price.toFixed(2)}`;

const hideServiceDetails = () => {
  serviceDetails.classList.add("hidden");
  serviceDetails.classList.remove("grid");

  serviceDuration.textContent = "—";
  servicePrice.textContent = "—";
};

const showServiceDetails = (service) => {
  serviceDuration.textContent = formatDuration(
    service.estimatedDurationMinutes,
  );

  servicePrice.textContent = formatPrice(service.basePrice);

  serviceDetails.classList.remove("hidden");
  serviceDetails.classList.add("grid");
};

const handleServiceChange = () => {
  const service = servicesById.get(serviceSelect.value);

  if (!service) {
    hideServiceDetails();
    return;
  }

  showServiceDetails(service);
};

export const initializeServiceSelection = () => {
  serviceSelect = document.querySelector("#appointment-service");
  serviceDetails = document.querySelector("#appointment-service-details");
  serviceDuration = document.querySelector("#appointment-service-duration");
  servicePrice = document.querySelector("#appointment-service-price");

  if (
    !serviceSelect ||
    !serviceDetails ||
    !serviceDuration ||
    !servicePrice
  ) {
    console.error("Service selection elements were not found.");
    return;
  }

  serviceSelect.replaceChildren(
    new Option("Select a service", ""),
  );

  servicesById.clear();

  testServices.forEach((service) => {
    servicesById.set(service._id, service);

    serviceSelect.add(
      new Option(service.name, service._id),
    );
  });

  serviceSelect.addEventListener("change", handleServiceChange);

  hideServiceDetails();
};
