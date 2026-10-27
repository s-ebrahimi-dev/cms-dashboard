import { getAllUser } from "../../funcs/shared.js";
import { base_URL } from "../../config.js";
import {
  showLoader,
  hideLoader,
  configureInnerLoader,
} from "../../funcs/loader.js";
import { loadComponent } from "../../components/component-Loader.js";
import { getCustomerVehicles } from "./appointment/vehicle-selection.js";
const customerTableBody = document.querySelector("#customers-table");

await loadComponent("customer-table-container", "/Components/loader.html");
configureInnerLoader("customer-table-container");

const getCustomers = async () => {
  const users = await getAllUser();

  if (!Array.isArray(users)) {
    throw new Error("Invalid users data");
  }

  const customers = users.filter((user) => user.role === "CUSTOMER");
  const customersWithVehicles = await Promise.all(
    customers.map(async (customer) => {
      const vehicles = await getCustomerVehicles(customer._id);

      return {
        ...customer,
        vehicles,
      };
    }),
  );
  return customersWithVehicles;
};

const renderCustomers = (customers) => {
  customerTableBody.innerHTML = "";
  customers.forEach((customer, index) => {
    const imageUrl = customer.hasProfileImage
      ? `${base_URL}/users/profile-image/${customer._id}`
      : `/images/default-profile.png`;

    const customerNumber =
      (currentCustomerPage - 1) * CUSTOMERS_PER_PAGE + index + 1;

    const vehicle = customer.vehicles[0];

    const vehicleHTML = vehicle
      ? `
      <p class="font-medium text-slate-800 dark:text-slate-200">
        ${vehicle.make} ${vehicle.model}
      </p>
      <p class="mt-1 text-xs text-slate-400">
        ${vehicle.year} • ${vehicle.licensePlate}
      </p>
    `
      : `
      <p class="text-sm text-slate-400">
        No vehicle registered
      </p>
    `;
    customerTableBody.insertAdjacentHTML(
      "beforeend",
      `
                      <tr class="border-b border-[#D9D9D3] dark:border-[#2A3540]">
                      <td
                      class=" p-3 text-lg"
                    >
                      ${customerNumber}
                    </td>
                    <td class="p-3">
                      <div class="flex items-center gap-3">
                        <img
                          src= ${imageUrl}
                          alt="${customer.firstname} ${customer.lastname}"
                          class="h-10 w-10 shrink-0 rounded-full object-cover"
                        />

                        <div class="min-w-0">
                          <p
                            class="truncate font-semibold text-slate-900 dark:text-white"
                          >
                            ${customer.firstname} ${customer.lastname}
                          </p>

                          <p class="mt-1 text-xs text-slate-400">
                            Customer #CUS-1024
                          </p>
                        </div>
                      </div>
                    </td>

                    <td class="p-3">
                      <div>
                        <p class="text-slate-700 dark:text-slate-300">
                          ${customer.phone}
                        </p>

                        <p class="mt-1 text-xs text-slate-400">
                          ${customer.email}
                        </p>
                      </div>
                    </td>

                    <td class="p-3">
                      <div>
                        <p
                          class="font-medium text-slate-800 dark:text-slate-200"
                        >
                          ${vehicleHTML}
                        </p>

                      </div>
                    </td>

                    <td
                      class="flex justify-center items-center p-3 font-semibold text-slate-800 dark:text-slate-200"
                    >
                      12
                    </td>

                    <td class="p-3">
                      <span class="text-slate-600 dark:text-slate-300">
                        Sep 18, 2026
                      </span>
                    </td>

                    <td class="p-3">
                      <span
                        class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      >
                       ${customer.username}
                      </span>
                    </td>

                    <td class="p-3 text-right">
                      <button
                        data-customer-id="${customer._id}"
                        type="button"
                        class="rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
                      >
                        View
                      </button>
                    </td>
                  </tr>
            `,
    );
  });
};


const CUSTOMERS_PER_PAGE = 5;

let customers = [];
let currentCustomerPage = 1;

// Pagination elements
const prevPageButton = document.querySelector("#customers-prev-page");
const nextPageButton = document.querySelector("#customers-next-page");
const paginationInfo = document.querySelector("#customers-pagination-info");
const pageIndicator = document.querySelector("#customers-page-indicator");

function renderCustomersTable() {
  if (!customerTableBody) return;

  const totalCustomers = customers.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE),
  );

  // Keep the current page within valid boundaries.
  currentCustomerPage = Math.min(Math.max(currentCustomerPage, 1), totalPages);

  const startIndex = (currentCustomerPage - 1) * CUSTOMERS_PER_PAGE;

  const endIndex = Math.min(startIndex + CUSTOMERS_PER_PAGE, totalCustomers);

  const customersToShow = customers.slice(startIndex, endIndex);

  // Render only the customers on the current page.
  if (customersToShow.length === 0) {
    customerTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="p-6 text-center text-slate-500">
          No customers found.
        </td>
      </tr>
    `;
  } else {
    renderCustomers(customersToShow);
  }

  // Update pagination information.
  if (paginationInfo) {
    const firstCustomer = totalCustomers === 0 ? 0 : startIndex + 1;

    paginationInfo.textContent = `Showing ${firstCustomer}–${endIndex} of ${totalCustomers} customers`;
  }

  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentCustomerPage} of ${totalPages}`;
  }

  // Update navigation buttons.
  if (prevPageButton) {
    prevPageButton.disabled = currentCustomerPage === 1;
  }

  if (nextPageButton) {
    nextPageButton.disabled = currentCustomerPage === totalPages;
  }
}

// Navigate to the previous page.
prevPageButton?.addEventListener("click", () => {
  if (currentCustomerPage > 1) {
    customerTableBody.style.opacity = "0"; // Optional: Add a visual cue for loading
    setTimeout(() => {
      currentCustomerPage--;
      renderCustomersTable();
      customerTableBody.style.opacity = "1"; // Reset opacity after rendering
    }, 200); // Adjust the timeout duration as needed
  }
});

// Navigate to the next page.
nextPageButton?.addEventListener("click", () => {
  const totalPages = Math.ceil(customers.length / CUSTOMERS_PER_PAGE);

  if (currentCustomerPage < totalPages) {
    customerTableBody.style.opacity = "0"; // Optional: Add a visual cue for loading
    setTimeout(() => {
      currentCustomerPage++;
      renderCustomersTable();
      customerTableBody.style.opacity = "1"; // Reset opacity after rendering
    }, 200); // Adjust the timeout duration as needed
  }
});

// Load customers once.
const showAllCustomer = async () => {
  showLoader("Loading customers", "Please wait", "customer-table-container");

  try {
    customers = await getCustomers();

    // Start from the first page after loading.
    currentCustomerPage = 1;
    updateCustomerPageContent(customers);
    renderCustomersTable();
  } catch (error) {
    console.error("Loading customers failed:", error);
  } finally {
    hideLoader("customer-table-container");
  }
};
const updateCustomerPageContent = (customers) => {
  const totalCustomersElem = document.querySelector("#total-customer");

  totalCustomersElem.textContent = customers?.length;
};
await showAllCustomer();

const initCustomerFullModal = async () => {
  await loadComponent("customer-modal-container", "/Components/receptionist/customer-full-infos.html")
}

await initCustomerFullModal()
const customerFullModal = document.querySelector("#customer-full-modal");


const customerModalCloseBtn = document.querySelector(
  "#customer-details-done",
);

const customerModalCloseXBtn = document.querySelector(
  "#close-customer-details-modal",
);

const setCustomerText = (selector, value) => {
  const element = customerFullModal.querySelector(selector);

  if (element) {
    element.textContent = value ?? "Not provided";
  }
};

const renderCustomerVehicles = (vehicles = []) => {
  const container = customerFullModal.querySelector(
    "#details-customer-vehicles",
  );

  const count = customerFullModal.querySelector(
    "#details-customer-vehicle-count",
  );

  if (!container || !count) return;

  count.textContent = String(vehicles.length);
  container.innerHTML = "";

  if (vehicles.length === 0) {
    container.innerHTML = `
      <p class="py-6 text-center text-sm text-slate-500">
        No vehicles registered.
      </p>
    `;
    return;
  }

  vehicles.forEach((vehicle) => {
    const card = document.createElement("div");
    card.className =
      "rounded-xl border border-slate-200 p-4 dark:border-[#2A3540]";

    const title = document.createElement("p");
    title.className = "font-semibold text-slate-800 dark:text-white";
    title.textContent =
      [vehicle.make, vehicle.model].filter(Boolean).join(" ") ||
      "Unnamed vehicle";

    const details = document.createElement("p");
    details.className = "mt-2 text-sm text-slate-500";
    details.textContent = [
      vehicle.year,
      vehicle.licensePlate,
    ]
      .filter((value) => value != null && value !== "")
      .join(" • ") || "No additional vehicle information";

    card.append(title, details);
    container.append(card);
  });
};

const showCustomerModal = (customer) => {
  if (!customer) return;

  const fullName =
    [customer.firstname, customer.lastname]
      .filter(Boolean)
      .join(" ") || "Unnamed customer";

  const image = customerFullModal.querySelector(
    "#details-customer-image",
  );

  setCustomerText("#details-customer-name", fullName);
  setCustomerText("#details-customer-username", customer.username);
  setCustomerText("#details-customer-phone", customer.phone);
  setCustomerText("#details-customer-email", customer.email);
  setCustomerText("#details-customer-username-card", customer.username);
  setCustomerText("#details-customer-id", customer._id);

  if (image) {
    image.src = customer.hasProfileImage
      ? `${base_URL}/users/profile-image/${customer._id}`
      : "/images/default-profile.png";

    image.alt = fullName;
    image.onerror = () => {
      image.onerror = null;
      image.src = "/images/default-profile.png";
    };
  }

  renderCustomerVehicles(customer.vehicles);

  customerFullModal.classList.remove("hidden");
  customerFullModal.classList.add("flex");
};

const hideCustomerModal = () => {
  customerFullModal.classList.add("hidden");
  customerFullModal.classList.remove("flex");
};

// Event delegation supports dynamically rendered rows and pagination.
customerTableBody?.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-customer-id]");

  if (!viewButton || !customerTableBody.contains(viewButton)) return;

  const customerId = viewButton.dataset.customerId;

  const selectedCustomer = customers.find(
    (customer) => String(customer._id) === customerId,
  );

  if (!selectedCustomer) {
    console.error("Selected customer was not found:", customerId);
    return;
  }

  showCustomerModal(selectedCustomer);
});

customerModalCloseBtn?.addEventListener("click", hideCustomerModal);
customerModalCloseXBtn?.addEventListener("click", hideCustomerModal);

customerFullModal.addEventListener("click", (event) => {
  if (event.target === customerFullModal) {
    hideCustomerModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !customerFullModal.classList.contains("hidden")
  ) {
    hideCustomerModal();
  }
});
