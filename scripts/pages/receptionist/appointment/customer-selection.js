import { base_URL } from "../../../config.js";
import { loadComponent } from "../../../components/component-Loader.js";
import { getAllUser } from "../../../funcs/shared.js";
import { showResultModal } from "../../../components/result-modal.js";
import { showLoader, hideLoader } from "../../../funcs/loader.js";

let selectedCustomer = null;
let selectedCustomerBox;
let resultSearchBox;
let searchInput;

const setCustomerMode = (mode) => {
  const existingButton = document.querySelector("#existing-customer-mode");
  const newButton = document.querySelector("#new-customer-mode");
  const existingPanel = document.querySelector("#existing-customer-panel");
  const newPanel = document.querySelector("#new-customer-panel");
  const indicator = document.querySelector("#customer-mode-indicator");

  if (
    !existingButton ||
    !newButton ||
    !existingPanel ||
    !newPanel ||
    !indicator
  ) {
    return;
  }

  const isExisting = mode === "existing";

  existingPanel.classList.toggle("hidden", !isExisting);
  newPanel.classList.toggle("hidden", isExisting);

  // Only validate fields belonging to the active customer mode.
  newPanel.querySelectorAll("input, select, textarea").forEach((field) => {
    field.disabled = isExisting;
  });

  indicator.classList.toggle("translate-x-full", !isExisting);

  existingButton.setAttribute("aria-pressed", String(isExisting));
  newButton.setAttribute("aria-pressed", String(!isExisting));

  existingButton.classList.toggle("font-semibold", isExisting);
  existingButton.classList.toggle("font-medium", !isExisting);
  existingButton.classList.toggle("text-gray-900", isExisting);
  existingButton.classList.toggle("text-gray-600", !isExisting);
  existingButton.classList.toggle("dark:text-white", isExisting);
  existingButton.classList.toggle("dark:text-zinc-400", !isExisting);

  newButton.classList.toggle("font-semibold", !isExisting);
  newButton.classList.toggle("font-medium", isExisting);
  newButton.classList.toggle("text-gray-900", !isExisting);
  newButton.classList.toggle("text-gray-600", isExisting);
  newButton.classList.toggle("dark:text-white", !isExisting);
  newButton.classList.toggle("dark:text-zinc-400", isExisting);

  notifyCustomerSelectionChanged();
};

function renderCustomerResult(customer) {
  const button = document.createElement("button");

  button.type = "button";
  button.id = customer._id;
  button.className =
    "customer group flex w-full items-center gap-3 border-b border-gray-100 " +
    "px-4 py-3 text-left cursor-default sm:cursor-pointer transition-colors duration-200 " +
    "last:border-b-0 hover:bg-indigo-50/70 focus-visible:bg-indigo-50 " +
    "focus-visible:outline-none dark:border-zinc-700 dark:hover:bg-zinc-700/60 " +
    "dark:focus-visible:bg-zinc-700";

  const avatar = document.createElement("div");
  avatar.className =
    "size-11 shrink-0 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-500/20";

  const image = document.createElement("img");
  image.className = "size-full object-cover";
  image.alt = `${customer.firstname ?? ""} ${customer.lastname ?? ""}`.trim();
  image.src = `${base_URL}/users/profile-image/${customer._id}`;

  image.onerror = () => {
    const fallback = document.createElement("div");
    fallback.className =
      "flex size-full items-center justify-center text-sm font-semibold " +
      "text-indigo-700 dark:text-indigo-300";
    fallback.textContent =
      `${customer.firstname?.[0] ?? ""}${customer.lastname?.[0] ?? ""}`.toUpperCase();

    avatar.replaceChildren(fallback);
  };

  avatar.append(image);

  const info = document.createElement("div");
  info.className = "min-w-0 flex-1";

  const fullName = document.createElement("p");
  fullName.className =
    "truncate text-sm font-semibold text-gray-900 dark:text-zinc-100";
  fullName.textContent =
    `${customer.firstname ?? ""} ${customer.lastname ?? ""}`.trim();

  const username = document.createElement("p");
  username.className =
    "mt-0.5 truncate text-xs text-gray-500 dark:text-zinc-400";
  username.textContent = `@${customer.username ?? ""}`;

  const contact = document.createElement("p");
  contact.className = "mt-1 truncate text-xs text-gray-500 dark:text-zinc-400";
  contact.textContent =
    customer.email || customer.phone || "No contact information";

  info.append(fullName, username, contact);

  const arrow = document.createElement("span");
  arrow.className =
    "shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 " +
    "group-hover:text-indigo-600 dark:group-hover:text-indigo-400";
  arrow.textContent = "›";

  button.append(avatar, info, arrow);
  return button;
}

function showCustomerDetails(user) {
  const modal = document.querySelector("#customer-details-modal");
  const name = document.querySelector("#details-customer-name");
  const username = document.querySelector("#details-customer-username");
  const image = document.querySelector("#details-customer-image");
  const personalInfo = document.querySelector("#personal-infos");
  const selectButton = document.querySelector("#select-customer-from-details");
  const closeButton = document.querySelector("#close-customer-details");
  const cancelButton = document.querySelector("#cancel-customer-details");

  if (
    !modal ||
    !name ||
    !username ||
    !image ||
    !personalInfo ||
    !selectButton ||
    !closeButton ||
    !cancelButton
  ) {
    throw new Error("Customer detail modal is missing required elements.");
  }

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  // Assign handlers instead of adding new listeners every time.
  closeButton.onclick = () => {
    closeModal();
    resultSearchBox.innerHTML = "";
  };
  cancelButton.onclick = () => {
    closeModal();
    resultSearchBox.innerHTML = "";
  };

  name.textContent = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
  username.textContent = user.username ?? "";
  image.src = user.profileImage
    ? `${base_URL}/users/profile-image/${user._id}`
    : "/images/default-profile.png";

  personalInfo.innerHTML = `
    <div>
      <p class="text-sm text-gray-500 dark:text-zinc-400">First name</p>
      <p class="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white"></p>
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-zinc-400">Last name</p>
      <p class="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white"></p>
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-zinc-400">Phone</p>
      <p class="mt-1 wrap-break-word text-sm font-medium text-gray-900 dark:text-white"></p>
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-zinc-400">Email</p>
      <p class="mt-1 break-all text-sm font-medium text-gray-900 dark:text-white"></p>
    </div>
  `;

  const values = personalInfo.querySelectorAll("div > p:last-child");
  values[0].textContent = user.firstname ?? "—";
  values[1].textContent = user.lastname ?? "—";
  values[2].textContent = user.phone ?? "—";
  values[3].textContent = user.email ?? "—";

  // Replace the previous handler when a different customer is opened.
  selectButton.onclick = () => {
    selectedCustomer = user;
    const selectedName = document.querySelector(
      "#selected-appointment-customer-name",
    );
    const selectedUsername = document.querySelector(
      "#selected-appointment-customer-username",
    );
    const selectedPhone = document.querySelector(
      "#selected-appointment-customer-phone",
    );
    const selectedEmail = document.querySelector(
      "#selected-appointment-customer-email",
    );
    const selectedImage = document.querySelector(
      "#selected-appointment-customer-image",
    );

    if (
      !selectedCustomerBox ||
      !selectedName ||
      !selectedUsername ||
      !selectedPhone ||
      !selectedEmail ||
      !selectedImage
    ) {
      console.error("Selected-customer elements are missing.");
      return;
    }

    selectedName.textContent =
      `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim();
    selectedUsername.textContent = user.username ?? "";
    selectedPhone.textContent = user.phone ?? "—";
    selectedEmail.textContent = user.email ?? "—";
    selectedImage.src = user.profileImage
      ? `${base_URL}/users/profile-image/${user._id}`
      : "/images/default-profile.png";

    selectedCustomerBox.classList.remove("hidden");
    resultSearchBox?.replaceChildren();
    resultSearchBox?.classList.add("hidden");
    resultSearchBox?.classList.remove("flex");

    closeModal();
    notifyCustomerSelectionChanged();
    const removeSlecetedCustomerBtn = document.querySelector(
      "#remove-selected-appointment-customer",
    );
    if (removeSlecetedCustomerBtn) {
      removeSlecetedCustomerBtn.onclick = () => {
        selectedCustomerBox.classList.add("hidden");
        selectedName.textContent = "";
        selectedUsername.textContent = "";
        selectedPhone.textContent = "";
        selectedEmail.textContent = "";
        selectedImage.src = "";
      };
    }
  };

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function resetCustomerSelection() {
  selectedCustomer = null;

  // Hide the row; do not destroy its child elements.
  selectedCustomerBox?.classList.add("hidden");

  resultSearchBox?.replaceChildren();
  resultSearchBox?.classList.add("hidden");
  resultSearchBox?.classList.remove("flex");

  if (searchInput) {
    searchInput.value = "";
  }
  notifyCustomerSelectionChanged();
}
export function getSelectedCustomer() {
  return selectedCustomer;
}

export async function initializeCustomerSelection() {
  selectedCustomerBox = document.querySelector(
    "#selected-appointment-customer",
  );
  resultSearchBox = document.querySelector("#appointment-customer-results");
  searchInput = document.querySelector("#appointment-customer-search");
  const existingButton = document.querySelector("#existing-customer-mode");
  const newButton = document.querySelector("#new-customer-mode");

  existingButton?.addEventListener("click", () => setCustomerMode("existing"));
  newButton?.addEventListener("click", () => setCustomerMode("new"));

  if (!searchInput || !resultSearchBox) {
    console.error("Customer search elements were not found.");
    return;
  }

  let customers = [];

  try {
    const users = await getAllUser();
    customers = users.filter((user) => user.role === "CUSTOMER");
  } catch (error) {
    console.error("Failed to load customers:", error);
    showResultModal("error", "Failed to load customers.");
    return;
  }

  searchInput.addEventListener("input", (event) => {
    const searchValue = event.target.value.trim().toLowerCase();

    resultSearchBox.replaceChildren();

    if (!searchValue) {
      resultSearchBox.classList.add("hidden");
      resultSearchBox.classList.remove("flex");
      return;
    }

    const matches = customers.filter((customer) =>
      (customer.firstname ?? "").toLowerCase().startsWith(searchValue),
    );

    matches.forEach((customer) => {
      resultSearchBox.append(renderCustomerResult(customer));
    });

    resultSearchBox.classList.remove("hidden");
    resultSearchBox.classList.add("flex");
  });

  resultSearchBox.addEventListener("click", async (event) => {
    const customerButton = event.target.closest(".customer");

    if (!customerButton || !resultSearchBox.contains(customerButton)) {
      return;
    }

    searchInput.value = "";
    showLoader("Loading customer", "Please wait...");

    try {
      const response = await fetch(`${base_URL}/users/${customerButton.id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        showResultModal("error", "Customer Not Found");
        return;
      }

      const customer = await response.json();

      await loadComponent(
        "customer-detail-infos",
        "/Components/receptionist/customer-detail-information.html",
      );

      if (!customer?.data) {
        throw new Error("Customer data was missing from the response.");
      }

      showCustomerDetails(customer.data);
    } catch (error) {
      console.error("Failed to load customer details:", error);
      showResultModal("error", "Failed to load customer details.");
    } finally {
      hideLoader();
    }
  });
  setCustomerMode("existing");
}

export function isCustomerReady() {
  const newCustomerButton = document.querySelector("#new-customer-mode");
  const newCustomerPanel = document.querySelector("#new-customer-panel");

  const isNewCustomerMode =
    newCustomerButton?.getAttribute("aria-pressed") === "true";

  if (!isNewCustomerMode) {
    return Boolean(selectedCustomer);
  }

  if (!newCustomerPanel) {
    return false;
  }

  const requiredFields = [
    ...newCustomerPanel.querySelectorAll(
      "input[required], select[required], textarea[required]",
    ),
  ];

  return (
    requiredFields.length > 0 &&
    requiredFields.every((field) => field.checkValidity())
  );
}

function notifyCustomerSelectionChanged() {
  document.dispatchEvent(new CustomEvent("appointment:customer-changed"));
}
