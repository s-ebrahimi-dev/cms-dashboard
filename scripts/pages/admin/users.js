import { createUser } from "../../funcs/auth.js";
import {
  getAndShowAllUsers,
} from "../../funcs/shared.js";

const userModal = document.querySelector("#createUserModal");
const createUserBtn = document.querySelector("#openCreateUserModal");
const cancelCreateUser = document.querySelector("#cancelCreateUser");
const closeCreateModal = document.querySelector("#closeCreateUserModal");
const submitUserBtn = document.querySelector("#submit-user");
const roleSelect = document.querySelector("#createRole");
const capacityField = document.querySelector("#technician-capacity-field");
const capacityInput = document.querySelector("#maxConcurrentVehicles");

const technicianRoles = [
  "MECHANIC",
  "OIL_TECHNICIAN",
  "BODY_REPAIR",
  "DETAILING_TECHNICIAN",
  "WASH_TECHNICIAN",
];

function updateTechnicianCapacityField() {
  const isTechnician = technicianRoles.includes(roleSelect.value);

  capacityField.classList.toggle("hidden", !isTechnician);
  capacityInput.required = isTechnician;
}

roleSelect.addEventListener("change", updateTechnicianCapacityField);

updateTechnicianCapacityField();
  getAndShowAllUsers();

createUserBtn.addEventListener("click", (event) => {
  event.preventDefault();
  userModal.classList.remove("hidden");
});

const hideCreateUserModal = () => {
  userModal.classList.add("hidden");
};

submitUserBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  hideCreateUserModal();
  await createUser();
  await getAndShowAllUsers();
});



cancelCreateUser.addEventListener("click", hideCreateUserModal);
closeCreateModal.addEventListener("click", hideCreateUserModal);
