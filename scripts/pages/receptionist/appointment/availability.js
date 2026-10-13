import { base_URL } from "../../../config.js";
let serviceSelect;
let scheduledDateInput;
let timeSlotSelect;
let slotMessage;

const resetTimeSlots = (message) => {
  timeSlotSelect.replaceChildren(
    new Option("Select an available time", ""),
  );

  timeSlotSelect.disabled = true;
  slotMessage.textContent = message;
};

const formatSlotTime = (isoDate) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoDate));
};

const loadAvailableSlots = async () => {
  const serviceId = serviceSelect.value;
  const date = scheduledDateInput.value;

  if (!serviceId || !date) {
    resetTimeSlots(
      "Select a service and date to view available times.",
    );
    return;
  }

  resetTimeSlots("Loading available times...");

  try {
    const query = new URLSearchParams({ serviceId, date });
    console.log("Selected service:", serviceSelect.value);
console.log("Query string:", query.toString());
    const response = await fetch(
      `${base_URL}/appointments/availability?${query}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to load available times.",
      );
    }

    const slots = result.data;

    if (!Array.isArray(slots) || slots.length === 0) {
      resetTimeSlots("No available times for this date.");
      return;
    }

    timeSlotSelect.replaceChildren(
      new Option("Select an available time", ""),
    );

    slots.forEach((slot) => {
      const option = new Option(
        formatSlotTime(slot.start),
        slot.start,
      );

      timeSlotSelect.add(option);
    });

    timeSlotSelect.disabled = false;
    slotMessage.textContent =
      `${slots.length} available time slots.`;
  } catch (error) {
    console.error("LOAD AVAILABLE SLOTS ERROR:", error);

    resetTimeSlots(
      error.message || "Unable to load available times.",
    );
  }
};

export const initializeAvailability = () => {
  serviceSelect = document.querySelector("#appointment-service");

  scheduledDateInput = document.querySelector(
    "#appointment-scheduled-date",
  );

  timeSlotSelect = document.querySelector(
    "#appointment-time-slot",
  );

  slotMessage = document.querySelector(
    "#appointment-slot-message",
  );

  if (
    !serviceSelect ||
    !scheduledDateInput ||
    !timeSlotSelect ||
    !slotMessage
  ) {
    console.error("Availability elements were not found.");
    return;
  }

  scheduledDateInput.disabled = !serviceSelect.value;

  resetTimeSlots(
    serviceSelect.value
      ? "Choose a date to view available times."
      : "Select a service and date to view available times.",
  );

  serviceSelect.addEventListener("change", () => {
    scheduledDateInput.value = "";
    scheduledDateInput.disabled = !serviceSelect.value;

    resetTimeSlots(
      serviceSelect.value
        ? "Choose a date to view available times."
        : "Select a service and date to view available times.",
    );
  });

  scheduledDateInput.addEventListener(
    "change",
    loadAvailableSlots,
  );
};
