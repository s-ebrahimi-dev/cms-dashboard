import { getMyVehicles } from "../../funcs/shared.js";
const vehicleContainer = document.getElementById("vehicle-container");
const showVehicles = async () => {
  try {
    const vehicle = await getMyVehicles();
    console.log(vehicle);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
};
await showVehicles();
