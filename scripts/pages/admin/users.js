import { createUser } from "../../funcs/auth.js";
import {
  getAndShowAllUsers,
} from "../../funcs/shared.js";


const userModal = document.querySelector("#createUserModal");
const createUserBtn = document.querySelector("#openCreateUserModal");
const cancelCreateUser = document.querySelector("#cancelCreateUser");
const closeCreateModal = document.querySelector("#closeCreateUserModal");
const submitUserBtn = document.querySelector("#submit-user");
const deleteUserBtn = document.querySelector(".deleteUserBtn");

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

window.addEventListener("load", () => {
  getAndShowAllUsers();
});

cancelCreateUser.addEventListener("click", hideCreateUserModal);
closeCreateModal.addEventListener("click", hideCreateUserModal);
