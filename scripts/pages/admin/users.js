import { createUser } from "../../funcs/auth.js";

const userModal = document.querySelector("#createUserModal");
const createUserBtn = document.querySelector("#openCreateUserModal");
const cancelCreateUser = document.querySelector("#cancelCreateUser");
const closeCreateModal = document.querySelector("#closeCreateUserModal");
const submitUserBtn = document.querySelector("#submit-user")


createUserBtn.addEventListener("click", (event) => {
  event.preventDefault();
  userModal.classList.remove("hidden");
});

const hideCreateUserModal = () => {
  userModal.classList.add("hidden");
};

submitUserBtn.addEventListener("click", (event) => {
    event.preventDefault()
    createUser()
})

cancelCreateUser.addEventListener("click", hideCreateUserModal);
closeCreateModal.addEventListener("click", hideCreateUserModal);
