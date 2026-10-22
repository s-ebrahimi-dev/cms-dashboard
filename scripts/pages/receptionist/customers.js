import { getAllUser } from "../../funcs/shared.js";
import { base_URL } from "../../config.js";
import { getCustomerVehicles } from "./appointment/vehicle-selection.js";
const customersTableBody = document.querySelector("#customers-table");
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
  customersTableBody.innerHTML = "";
  customers.forEach((customer) => {
    const imageUrl = customer.hasProfileImage
      ? `${base_URL}/users/profile-image/${customer._id}`
      : `/images/default-profile.png`;
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
    customersTableBody.insertAdjacentHTML(
      "beforeend",
      `
                      <tr class="border-b border-[#D9D9D3] dark:border-[#2A3540]">
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

const showAllCustomer = async () => {
  try {
    const customers = await getCustomers();
    console.log(customers);

    renderCustomers(customers);
  } catch (error) {
    console.error("Loading customers failed:", error);
  }
};
await showAllCustomer();
