import { base_URL } from "../../config.js";
import { loadComponent } from "../../components/component-Loader.js";
import {
  getAllUser,
  openCreateAppointmentModal,
  closeCreateAppointmentModal,
} from "../../funcs/shared.js";
import { showResultModal } from "../../components/result-modal.js";
import { showLoader, hideLoader } from "../../funcs/loader.js";
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
// Change "Existing and New Vehicle's Button" state

const existingVehicleMode = document.querySelector("#existing-vehicle-mode");
const newVehicleMode = document.querySelector("#new-vehicle-mode");
const vehicleModeIndicator = document.querySelector("#vehicle-mode-indicator");

const existingVehiclePanel = document.querySelector("#existing-vehicle-panel");
const newVehiclePanel = document.querySelector("#new-vehicle-panel");

const vehicleSelect = document.querySelector("#appointment-vehicle");
const vehicleDetails = document.querySelector("#appointment-vehicle-details");
const noVehiclesMessage = document.querySelector("#appointment-no-vehicles");
const registerVehicleFromEmpty = document.querySelector(
  "#register-vehicle-from-empty",
);

const newVehicleError = document.querySelector("#new-vehicle-error");

let vehicleMode = "existing";

function setVehicleMode(mode) {
  vehicleMode = mode;

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
}

existingVehicleMode.addEventListener("click", () => {
  setVehicleMode("existing");
});

newVehicleMode.addEventListener("click", () => {
  setVehicleMode("new");
});

registerVehicleFromEmpty.addEventListener("click", () => {
  setVehicleMode("new");
});

vehicleSelect.addEventListener("change", () => {
  vehicleDetails.classList.toggle("hidden", !vehicleSelect.value);
});

// Initial state
setVehicleMode("existing");


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
    customerResult.id = `${customer._id}`;
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
  serachExistingCustomerInputElem.value = "";

  showLoader("Loading customer", "Please wait...");

  try {
    const res = await fetch(`${base_URL}/users/${customerBtn.id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      showResultModal("error", "Customer Not Found");
      return;
    }

    const customer = await res.json();

    await loadComponent(
      "customer-detail-infos",
      "/Components/receptionist/customer-detail-information.html",
    );

    const customerDetailModal = document.querySelector(
      "#customer-details-modal",
    );

    if (!customerDetailModal) {
      throw new Error("Customer details modal was not loaded.");
    }

    const closeCustomerDetailModalBtn = document.querySelector(
      "#close-customer-details",
    );

    const cancelCustomerDetailModalBtn = document.querySelector(
      "#cancel-customer-details",
    );

    const closeModal = () => {
      customerDetailModal.classList.add("hidden");
      customerDetailModal.classList.remove("flex");
    };

    closeCustomerDetailModalBtn.addEventListener("click", closeModal);

    cancelCustomerDetailModalBtn.addEventListener("click", closeModal);

    // TODO: Populate the modal using the fetched customer data.
    console.log("Fetched customer:", customer);

    customerDetailModal.classList.remove("hidden");
    customerDetailModal.classList.add("flex");
    if (customer) {
      const user = customer.data
      const customerPersonalInfosElem = document.querySelector("#personal-infos")
      const customerDetailNameElem = document.querySelector("#details-customer-name")
      const customerDetailUsernameElem = document.querySelector("#details-customer-username")
      const customerDetailImgElem = document.querySelector("#details-customer-image")
      console.log(customerDetailImgElem);
      
      customerDetailNameElem.innerHTML = `${user.firstname} ${user.lastname}`
      customerDetailUsernameElem.innerHTML = `${user.username}`
      customerDetailImgElem.src = user.profileImage ? `${base_URL}/users/profile-image/${user._id}` : "/images/default-profile.png"
      customerPersonalInfosElem.innerHTML = "";
      customerPersonalInfosElem.insertAdjacentHTML("beforeend", `
         <div>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              ${user.firstname}
            </p>
            <p
              id="details-customer-firstname"
              class="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white"
            >—</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              ${user.lastname}
            </p>
            <p
              id="details-customer-lastname"
              class="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white"
            >—</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              ${user.phone}
            </p>
            <p
              id="details-customer-phone"
              class="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white"
            >—</p>
          </div>

          <div>
            <p class="text-sm text-gray-500 dark:text-zinc-400">
              ${user.email}
            </p>
            <p
              id="details-customer-email"
              class="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white"
            >—</p>
          </div>
        `)
      
    }

  } catch (error) {
    console.error("Failed to load customer details:", error);

    showResultModal("error", "Failed to load customer details.");
  } finally {
    hideLoader();
  }
});

// Color List For Create New Appointment 

const initializeVehicleColorDropdown = () => {
  const dropdown = document.querySelector("#new-vehicle-color-dropdown");
  const hiddenInput = document.querySelector("#new-vehicle-color");
  const trigger = document.querySelector("#new-vehicle-color-trigger");
  const optionsContainer = document.querySelector("#new-vehicle-color-options");
  const selectedSwatch = document.querySelector("#new-vehicle-color-swatch");
  const selectedLabel = document.querySelector("#new-vehicle-color-label");
  const chevron = document.querySelector("#new-vehicle-color-chevron");

  if (
    !dropdown ||
    !hiddenInput ||
    !trigger ||
    !optionsContainer ||
    !selectedSwatch ||
    !selectedLabel ||
    !chevron
  ) {
    console.error("Vehicle color dropdown elements not found.");
    return;
  }

  const colorGroups = [
    {
      label: "Common Colors",
      colors: [
        ["White", "#FFFFFF"],
        ["Black", "#171717"],
        ["Silver", "#C0C0C0"],
        ["Gray", "#808080"],
        ["Red", "#DC2626"],
        ["Blue", "#2563EB"],
        ["Green", "#15803D"],
        ["Yellow", "#FACC15"],
        ["Orange", "#F97316"],
        ["Brown", "#854D0E"],
        ["Beige", "#D6C3A1"],
        ["Gold", "#D4AF37"],
      ],
    },
    {
      label: "Additional Colors",
      colors: [
        ["Navy Blue", "#172554"],
        ["Light Blue", "#7DD3FC"],
        ["Dark Blue", "#1E3A8A"],
        ["Maroon", "#800000"],
        ["Burgundy", "#800020"],
        ["Purple", "#9333EA"],
        ["Teal", "#0F766E"],
        ["Olive", "#808000"],
        ["Champagne", "#F7E7CE"],
        ["Bronze", "#CD7F32"],
        ["Copper", "#B87333"],
        ["Cream", "#FFFDD0"],
        ["Ivory", "#FFFFF0"],
      ],
    },
    {
      label: "Special Finishes",
      colors: [
        ["Pearl White", "#F8F6F0"],
        ["Metallic Silver", "#AEB4BB"],
        ["Metallic Gray", "#696969"],
        ["Metallic Black", "#292929"],
        ["Metallic Blue", "#244A73"],
        ["Metallic Red", "#9F202F"],
        ["Matte Black", "#252525"],
        ["Matte Gray", "#737373"],
        ["Two-Tone", null],
        ["Other", null],
      ],
    },
  ];

  const closeDropdown = () => {
    optionsContainer.classList.add("hidden");
    trigger.setAttribute("aria-expanded", "false");
    chevron.classList.remove("rotate-180");
  };

  const openDropdown = () => {
    optionsContainer.classList.remove("hidden");
    trigger.setAttribute("aria-expanded", "true");
    chevron.classList.add("rotate-180");
  };

  const selectColor = (name, hex) => {
    hiddenInput.value = name;
    selectedLabel.textContent = name;
    selectedLabel.classList.remove("text-gray-500", "dark:text-zinc-400");
    selectedLabel.classList.add("text-gray-900", "dark:text-white");

    selectedSwatch.style.backgroundColor = hex || "transparent";
    selectedSwatch.classList.toggle("border-dashed", !hex);

    trigger.setAttribute("aria-label", `Selected color: ${name}`);

    optionsContainer.querySelectorAll('[role="option"]').forEach((option) => {
      const isSelected = option.dataset.value === name;
      option.setAttribute("aria-selected", String(isSelected));

      const check = option.querySelector("[data-color-check]");
      check.classList.toggle("invisible", !isSelected);
    });

    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
    closeDropdown();
  };

  colorGroups.forEach((group) => {
    const heading = document.createElement("p");
    heading.className =
      "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500";
    heading.textContent = group.label;
    optionsContainer.append(heading);

    group.colors.forEach(([name, hex]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.role = "option";
      option.dataset.value = name;
      option.setAttribute("aria-selected", "false");
      option.className =
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800";

      const swatch = document.createElement("span");
      swatch.className =
        "h-5 w-5 shrink-0 rounded-md border border-gray-300 dark:border-zinc-600";

      if (hex) {
        swatch.style.backgroundColor = hex;
      } else {
        swatch.classList.add("bg-gray-100", "dark:bg-zinc-700");
        swatch.textContent = name === "Two-Tone" ? "½" : "…";
        swatch.classList.add("flex", "items-center", "justify-center", "text-xs");
      }

      const label = document.createElement("span");
      label.className = "flex-1";
      label.textContent = name;

      const check = document.createElement("span");
      check.dataset.colorCheck = "";
      check.className = "invisible text-indigo-600 dark:text-indigo-400";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";

      option.append(swatch, label, check);
      option.addEventListener("click", () => selectColor(name, hex));

      optionsContainer.append(option);
    });
  });

  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
      trigger.focus();
    }
  });

  // Reset the custom dropdown when the appointment form resets.
  const form = document.querySelector("#create-appointment-form");

  form?.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      hiddenInput.value = "";
      selectedLabel.textContent = "Select color";
      selectedLabel.classList.add("text-gray-500", "dark:text-zinc-400");
      selectedLabel.classList.remove("text-gray-900", "dark:text-white");
      selectedSwatch.style.backgroundColor = "#FFFFFF";
      selectedSwatch.classList.remove("border-dashed");
      trigger.setAttribute("aria-label", "Select vehicle color");

      optionsContainer.querySelectorAll('[role="option"]').forEach((option) => {
        option.setAttribute("aria-selected", "false");
        option.querySelector("[data-color-check]").classList.add("invisible");
      });

      closeDropdown();
    });
  });
};
initializeVehicleColorDropdown();

