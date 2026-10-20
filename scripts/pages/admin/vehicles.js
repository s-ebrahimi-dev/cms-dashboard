import { base_URL } from "../../config.js";

const getAllVehicles = async () => {
  try {
    const response = await fetch(`${base_URL}/vehicles/all`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: HTTP ${response.status}`);
    }
    const result = await response.json();
    if (!Array.isArray(result.data)) {
      throw new Error("The vehicles response is not an array.");
    }
    console.log(result.data);

    return result.data;
  } catch (error) {
    console.error("Failed to load vehicles:", error.message);
    throw error;
  }
};
await getAllVehicles();
