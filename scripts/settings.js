import { getMe } from "../scripts/funcs/auth.js";
import { loadComponent } from "./components/component-Loader.js";
import {
  previewProfileImage,
  uploadProfileImage,
  loadProfileImage,
} from "../scripts/funcs/profileImage.js";
import {
  initThemeSettings,
} from "./funcs/theme.js";
import { openEditUserModal, updateOwnProfile, closeEditUserModal, updateOwnAddress, } from "./funcs/shared.js";

import {
  showLoader,
  hideLoader,
} from "./funcs/loader.js";
import { loadUserInfos } from "./shared.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


let currentUser = null;
let selectedCoordinates = null;
let addressMap = null;
let addressMarker = null;
let addressRequestId = 0;
const imageInput = document.querySelector("#profile-image");
const profilePreview = document.querySelector("#profile-preview");
const settingsUserNameElem = document.querySelector("#settings-user-name")
const settingsUserEmailElem = document.querySelector("#settings-user-email")
const settingsUserRoleElem = document.querySelector("#settings-user-role")

const initSettings = async () => {
  try {
    const result = await getMe();

    currentUser = result.data;
    if (currentUser.address) {
  loadSavedAddress(currentUser.address);
}
    console.log(currentUser);
    
    settingsUserNameElem.textContent = `${currentUser.firstname} ${currentUser.lastname}`
    settingsUserEmailElem.innerHTML = currentUser.email
    settingsUserRoleElem.innerHTML = currentUser.role
    if (currentUser?.hasProfileImage) {
      await loadProfileImage(profilePreview);
    }
  } catch (error) {
    console.error("Failed to initialize settings:", error);
  }
};

// Image input Handler
imageInput.addEventListener("change", async () => {
  const file = imageInput.files[0];

  if (!file) return;

  // Show selected image immediately
  previewProfileImage(file, profilePreview);

  try {
    // Save image to backend/database
    await uploadProfileImage(file);
    // Update all header/sidebar profile images immediately 
    
  const imageURL = URL.createObjectURL(file);
    document.querySelectorAll(".user-image").forEach((image) => image.src = imageURL);

    console.log("Profile picture uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});


// Edit User Handler

const editModalContainer = document.querySelector(
  "#edit-user-modal-container"
);

if (editModalContainer) {
  await loadComponent(
    "edit-user-modal-container",
    "/Components/edit-user-modal.html"
  );
}
const editUserBtn = document.querySelector(".editUserBtn");
const confirmEditUserBtn = document.querySelector("#confirmEditUser");
const cancelEditUserBtn = document.querySelector("#cancelEditUser")
editUserBtn.addEventListener("click", () => {
  openEditUserModal(currentUser);
});

confirmEditUserBtn.addEventListener("click", async (event) => {
  event.preventDefault()
  closeEditUserModal()
  showLoader("Editing user profile", "please wait...")
  await updateOwnProfile();
  hideLoader()
  await initSettings()
  await loadUserInfos()
});

cancelEditUserBtn.addEventListener("click",  (event) => {
  event.preventDefault()
  closeEditUserModal()
})

// Address & Location
const populateAddressForm = (address) => {
  if (!address) return;

  const fields = {
    "address-country": address.country,
    "address-province": address.province || address.state,
    "address-city": address.city,
    "address-district": address.district || address.county,
    "address-street": address.street || address.name,
    "address-building": address.buildingNumber || address.housenumber,
    "address-unit": address.unit,
    "address-postal-code": address.postalCode || address.postcode,
  };

  Object.entries(fields).forEach(([id, value]) => {
    const input = document.getElementById(id);

    if (input && value != null && value !== "") {
      input.value = value;
    }
  });
};
const loadSavedAddress = (address) => {
  if (!address?.location?.coordinates) return;

  const [lng, lat] = address.location.coordinates;

  // Restore the selected coordinates.
  selectedCoordinates = { lat, lng };

  // Restore the address form.
  populateAddressForm(address);

  // Restore the marker and map position.
  addressMarker.setLatLng([lat, lng]);
  addressMap.setView([lat, lng], 16);
};

const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const url = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Photon request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Photon response:", data);

    return data.features?.[0]?.properties ?? null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

const initAddressMap = () => {
  const mapContainer = document.getElementById("address-map");

  if (!mapContainer) return;

  const defaultCoordinates = [32, 53];

  addressMap = L.map(mapContainer).setView(defaultCoordinates, 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(addressMap);

  addressMarker = L.marker(defaultCoordinates).addTo(addressMap);

  addressMap.on("click", async (event) => {
    const { lat, lng } = event.latlng;

    addressMarker.setLatLng([lat, lng]);

    selectedCoordinates = { lat, lng };

    const requestId = ++addressRequestId;

    const address = await getAddressFromCoordinates(lat, lng);

    if (requestId !== addressRequestId) return;

    if (!address) {
      console.log("No address information found for this location.");
      return;
    }

    populateAddressForm(address);

    console.log("Retrieved address:", address);
  });

  return addressMap;
};
addressMap = initAddressMap();

await initSettings();
const saveAddressBtn = document.getElementById("save-address-btn");

const saveAddress = async () => {
  if (!selectedCoordinates) {
    console.warn("Please select a location on the map first.");
    return;
  }

  const address = {
    country: document.getElementById("address-country").value.trim(),
    province: document.getElementById("address-province").value.trim(),
    city: document.getElementById("address-city").value.trim(),
    district: document.getElementById("address-district").value.trim(),
    street: document.getElementById("address-street").value.trim(),
    buildingNumber: document.getElementById("address-building").value.trim(),
    unit: document.getElementById("address-unit").value.trim(),
    postalCode: document.getElementById("address-postal-code").value.trim(),

    location: {
      type: "Point",
      coordinates: [
        selectedCoordinates.lng,
        selectedCoordinates.lat,
      ],
    },
  };

  // Check the required address fields.
  if (!address.country || !address.city) {
    console.warn("Country and city are required.");
    return;
  }

  saveAddressBtn.disabled = true;
  const originalText = saveAddressBtn.textContent;
  saveAddressBtn.textContent = "Saving...";

  try {
    const result = await updateOwnAddress(address);

    if (!result) return;

    currentUser.address = result;
    console.log("Saved address:", currentUser.address);
  } catch (error) {
    console.error("Failed to save address:", error);
  } finally {
    saveAddressBtn.disabled = false;
    saveAddressBtn.textContent = originalText;
  }
};

saveAddressBtn?.addEventListener("click", saveAddress);

initThemeSettings();