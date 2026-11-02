import { getMyVehicles } from "../../funcs/shared.js";
import { loadComponent } from "../../components/component-Loader.js";

await loadComponent("vehicle-modal", "/Components/view-vehicleInfoModal.html")
const vehicleModal = document.querySelector("#vehicle-details-modal")
const vehicleContainer = document.getElementById("vehicle-container");

let vehicles = [];

function capitalizeWords(str = "") {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// show-vehicles
const showVehicles = async () => {
   vehicleContainer.innerHTML = `
    <p class="text-center text-slate-500">Loading vehicles...</p>
  `;
  try {
    vehicles = await getMyVehicles();
    if (!vehicles?.length) {
      vehicleContainer.innerHTML = `
    <p class="text-center text-slate-500">
      You haven't registered any vehicles yet.
    </p>
  `;
      return;
    }
    vehicleContainer.innerHTML = "";
    vehicles.forEach((vehicle) => {
      const vehicleName =
        `${capitalizeWords(vehicle?.make)} ` +
        `${capitalizeWords(vehicle?.model)}`;
      vehicleContainer.insertAdjacentHTML(
        "beforeend",
        `
          <article
              class="rounded-2xl border border-[#D9D9D3] bg-[#FCFBF8] p-5 shadow-sm dark:border-[#2A3540] dark:bg-[#151B23]"
            >
              <!-- Vehicle header -->

              <div
                class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div
                  class="flex min-w-0 flex-col items-center gap-4 min-[440px]:flex-row"
                >
                  <div
                    class="flex h-32 w-full shrink-0 items-center justify-center min-[440px]:w-70"
                  >
                    <img
                      src="/images/toyota.png"
                      alt="Toyota Camry"
                      class="h-32 w-70 max-w-full object-contain sm:h-48"
                    />
                  </div>

                  <div
                    class="min-w-0 max-w-full text-center min-[440px]:text-left"
                  >
                    <h2
                      class="text-xl font-bold text-slate-900 dark:text-white"
                    >
                      ${vehicleName}
                    </h2>

                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      ${vehicle.year}
                      <span class="mx-1">•</span>
                      ${vehicle.color}
                    </p>

                    <button
                    data-vehicle-id="${vehicle._id}"
                      class="editVehicleBtn mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      Edit Vehicle
                    </button>
                  </div>
                </div>
              </div>

              <!-- Vehicle stats -->

              <div
                class="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-100 p-4 dark:bg-[#1D2630] sm:grid-cols-3"
              >
                <div class="min-w-0">
                  <p class="text-[10px] text-slate-400 dark:text-slate-500">
                    Mileage
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    ${(vehicle.mileage ?? 0).toLocaleString()} km
                  </p>
                </div>

                <div class="min-w-0">
                  <p class="text-[10px] text-slate-400 dark:text-slate-500">
                    Total Services
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    3
                  </p>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-[10px] text-slate-400 dark:text-slate-500">
                    Last Service
                  </p>

                  <p
                    class="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Aug 15, 2026
                  </p>
                </div>
              </div>

              <!-- Vehicle details -->

              <div
                class="mt-5 border-t border-[#D9D9D3] pt-5 dark:border-[#2A3540]"
              >
                <h3 class="text-base font-bold text-slate-900 dark:text-white">
                  Vehicle Details
                </h3>

                <div class="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500">
                      Make
                    </p>

                    <p
                      class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      ${capitalizeWords(vehicle.make)}
                    </p>
                  </div>

                  <div>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500">
                      Model
                    </p>

                    <p
                      class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      ${capitalizeWords(vehicle.model)}
                    </p>
                  </div>

                  <div>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500">
                      Year
                    </p>

                    <p
                      class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      ${vehicle.year}
                    </p>
                  </div>

                  <div>
                    <p class="text-[11px] text-slate-400 dark:text-slate-500">
                      License Plate
                    </p>

                    <p
                      class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      ${vehicle.licensePlate}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          `,
      );
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    vehicleContainer.innerHTML = `
      <p class="text-center text-red-500">
        Unable to load vehicles. Please try again.
      </p>
    `;
  }
};

const closeVehicleModal = () => {
    if (!vehicleModal) {
    console.error("Vehicle modal was not found in the DOM.");
    return;
  }
  vehicleModal.classList.add("hidden");
  vehicleModal.classList.remove("flex");
}

const showVehicleModal = () => {
  if (!vehicleModal) {
    console.error("Vehicle modal was not found in the DOM.");
    return;
  }
  vehicleModal.classList.remove("hidden");
  vehicleModal.classList.add("flex");
};

const closeVehicleModalBtn = document.querySelector("#close-vehicle-modal")
const closeVehicleModalFooterBtn = document.querySelector("#close-vehicle-modal-footer")
closeVehicleModalBtn?.addEventListener("click", closeVehicleModal)
closeVehicleModalFooterBtn?.addEventListener("click", closeVehicleModal)

// edit-vehicle
const editVehicle = (vehicleId) => {
  const selectedVehicle = vehicles.find((vehicle) => vehicle._id === vehicleId);
  if (!selectedVehicle) return;
  console.log(selectedVehicle);
  
  showVehicleModal()
  
};

// vehicle-clickHandler
vehicleContainer.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".editVehicleBtn");

  if (!editBtn || !vehicleContainer.contains(editBtn)) return;

  const vehicleId = editBtn.dataset.vehicleId;

  editVehicle(vehicleId);
});
await showVehicles();
