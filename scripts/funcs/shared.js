import { base_URL } from "../config.js";
import { initResultModal, showResultModal } from "../components/result-modal.js";
import { loadComponent } from "../components/component-Loader.js";

await loadComponent(
  "result-modal-container",
  "/Components/result-modal.html",
)

initResultModal()
let currentDeleteUser = null;
let currentEditUser = null;
let currentChatUser = null;

// Delete User modal
const openDeleteUserModal = (user) => {
  const deleteUserModal = document.querySelector("#delete-user-modal");
  const deleteUserTitle = document.querySelector("#delete-user-title");
  const deleteUserMessage = document.querySelector("#delete-user-message");

  currentDeleteUser = user;
  deleteUserModal.classList.remove("hidden");
  deleteUserModal.classList.add("flex");

  deleteUserMessage.textContent = `Are you sure you want to delete ${user.username}?`;
};

const closeDeleteUserModal = () => {
  const deleteUserModal = document.querySelector("#delete-user-modal");

  deleteUserModal.classList.remove("flex");
  deleteUserModal.classList.add("hidden");

  currentDeleteUser = null;
};

const initDeleteUserModal = () => {
  const cancelDeleteUser = document.querySelector("#cancel-delete-user");
  const confirmDeleteUser = document.querySelector("#confirm-delete-user");

  cancelDeleteUser.addEventListener("click", () => {
    closeDeleteUserModal();
  });

  confirmDeleteUser.addEventListener("click", async () => {
    if (!currentDeleteUser) return;
    const userId = currentDeleteUser._id;

    closeDeleteUserModal();

    await deleteUser(userId);
    await getAndShowAllUsers();
  });
};

// Edit User Modal

const openEditUserModal = (user) => {
  const editUserModal = document.querySelector("#editUserModal");
  currentEditUser = user;
   document.querySelector("#editUserId").value = user._id;
  document.querySelector("#editFirstname").value = user.firstname;
  document.querySelector("#editLastname").value = user.lastname;
  document.querySelector("#editUsername").value = user.username;
  document.querySelector("#editEmail").value = user.email;
  document.querySelector("#editPhone").value = user.phone;
  document.querySelector("#editPassword").value = "";

  editUserModal.classList.remove("hidden");
  editUserModal.classList.add("flex");
};
const closeEditUserModal = () => {
  const editUserModal = document.querySelector("#editUserModal");

  editUserModal.classList.remove("flex");
  editUserModal.classList.add("hidden");

  currentEditUser = null;
};
const initEditUserModal = () => {
  const cancelEditUser = document.querySelector("#cancelEditUser");
  const confirmEditUser = document.querySelector("#confirmEditUser");

  cancelEditUser.addEventListener("click", () => {
    closeEditUserModal();
  });

  confirmEditUser.addEventListener("click", async () => {
    if (!currentEditUser) return;
    const userId = currentEditUser._id
    closeEditUserModal();

    await editUser(userId);
    await getAndShowAllUsers();
  });
};

// Chat User Modal

const openChatUserModal = (user) => {
    currentChatUser = user;

  document.querySelector("#chatUserImage").src = ...;
  document.querySelector("#chatUserFullname").textContent =
    `${user.firstname} ${user.lastname}`;
  document.querySelector("#chatUserUsername").textContent =
    `@${user.username}`;

  document.querySelector("#chatUserModal").classList.remove("hidden");
  document.querySelector("#chatUserModal").classList.add("flex");
}

const getAndShowAllUsers = async () => {
  const usersTable = document.querySelector("#usersTableBody");
  const roleConfig = {
    ADMIN: {
      label: "Administrator",
      classes: "bg-orange-50 text-orange-600",
    },

    CUSTOMER: {
      label: "Customer",
      classes: "bg-blue-50 text-blue-600",
    },

    RECEPTIONIST: {
      label: "Receptionist",
      classes: "bg-purple-50 text-purple-600",
    },

    MECHANIC: {
      label: "Mechanic",
      classes: "bg-green-50 text-green-600",
    },

    OIL_TECHNICIAN: {
      label: "Oil Technician",
      classes: "bg-yellow-50 text-yellow-600",
    },

    BODY_REPAIR: {
      label: "Body Repair",
      classes: "bg-red-50 text-red-600",
    },

    DETAILING_TECHNICIAN: {
      label: "Detailing Technician",
      classes: "bg-cyan-50 text-cyan-600",
    },

    WASH_TECHNICIAN: {
      label: "Wash Technician",
      classes: "bg-indigo-50 text-indigo-600",
    },
  };
  const res = await fetch(`${base_URL}/users`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await res.json();

  const users = result.data;

  usersTable.innerHTML = "";
  users.forEach((user) => {
    const role = roleConfig[user.role];
    let profileImageSrc = "/images/default-profile.png";

    if (user.profileImage?.data?.data?.length) {
      const bytes = new Uint8Array(user.profileImage.data.data);
      let binary = "";

      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });

      const base64 = btoa(binary);
      profileImageSrc = `data:${user.profileImage.contentType};base64,${base64}`;
    }

    usersTable.insertAdjacentHTML(
      "beforeend",
      `
      <tr class="transition">
                    <!-- USER -->

                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img
                            src="${profileImageSrc}"
                            alt="${user.firstname} ${user.lastname}"
                            class="h-10 w-10 shrink-0 rounded-full object-cover"/>

                        <div>
                          <p class="text-sm font-semibold text-slate-800 dark:text-white">
                            ${user.firstname} ${user.lastname}
                          </p>

                          <p class="text-xs text-slate-400">${user.username}</p>
                        </div>
                      </div>
                    </td>

                    <!-- EMAIL -->

                    <td class="whitespace-nowrap px-6 py-4 text-sm text-">
                      ${user.email}
                    </td>

                    <!-- ROLE -->

                    <td class="whitespace-nowrap px-6 py-4">
                      <span class="inline-flex rounded-full ${role.classes} px-3 py-1 text-xs font-semibold ">
                        ${role.label}
                      </span>
                    </td>

                    <!-- STATUS -->

                    <td class="whitespace-nowrap px-6 py-4">
                      <span class="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-white">
                        ${user.phone}
                      </span>
                    </td>

                    <!-- ACTIONS -->

                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="flex justify-end gap-2">

                       <button type="button" class="chatUserBtn rounded-lg p-2 text-slate-400 transition md:hover:bg-emerald-200 md:hover:dark:bg-emerald-100 hover:text-emerald-700 md:cursor-pointer" title="Chat user">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                          </svg>
                        </button>

                        <!-- EDIT -->

                        <button type="button" class="editUserBtn rounded-lg p-2 text-slate-400 transition md:hover:bg-blue-200 md:hover:dark:bg-blue-100 hover:text-blue-600 md:cursor-pointer" title="Edit user">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.5 16.154 6 17.5l1.346-4.5 9.516-8.513Z"></path>

                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125 16.875 4.5"></path>
                          </svg>
                        </button>

                        <!-- DELETE -->
  
                        <button type="button" class="deleteUserBtn rounded-lg p-2 text-slate-400 transition md:hover:bg-red-200 md:hover:dark:bg-red-100 hover:text-red-600 md:cursor-pointer" title="Delete user">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21.75H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-10.208 0c-.34.059-.68.114-1.022.166m1.022-.165a48.11 48.11 0 0 1 3.478-.397m7.73 0V4.58c0-1.18-.91-2.203-2.09-2.25a51.964 51.964 0 0 0-3.32 0C8.91 2.377 8 3.4 8 4.58v.813m7.73 0a48.667 48.667 0 0 0-7.73 0"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
      `,
    );
    const row = usersTable.lastElementChild;

    const editUserBtn = row.querySelector(".editUserBtn");
    const deleteUserBtn = row.querySelector(".deleteUserBtn");
    const chatUserBtn = row.querySelector(".chatUserBtn")
    chatUserBtn.addEventListener("click", () => {
      openChatUserModal(user);
    })
    editUserBtn.addEventListener("click", () => {
      openEditUserModal(user);
    });

    deleteUserBtn.addEventListener("click", () => {
      openDeleteUserModal(user);
    });
  });
};

const deleteUser = async (userId) => {
  const res = await fetch(`${base_URL}/users/delete/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  
  const result = await res.json();
    console.log(result);
  if (res.ok) {
    
    showResultModal("success","user deleted successfully",)
  } else {
     showResultModal(
                "error",
                result.message
            );
}
  

};

const editUser = async (userId) => {
  const firstnameElem = document.querySelector("#editFirstname");
  const lastnameElem = document.querySelector("#editLastname");
  const usernameElem = document.querySelector("#editUsername");
  const emailElem = document.querySelector("#editEmail");
  const phoneElem = document.querySelector("#editPhone");
  const passwordElem = document.querySelector("#editPassword");

  const updatedUser = {
    firstname: firstnameElem.value.trim(),
    lastname: lastnameElem.value.trim(),
    username: usernameElem.value.trim(),
    email: emailElem.value.trim(),
    phone: phoneElem.value.trim(),
    password: passwordElem.value.trim(),
  };

  const res = await fetch(`${base_URL}/users/update/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updatedUser),
  });
  console.log(res);
  const result = await res.json();
    console.log(result);
 if (res.ok) {
    
    showResultModal("success","user updated successfully",)
  } else {
     showResultModal(
                "error",
                result.message
            );
}
};

export {
  getAndShowAllUsers,
  openDeleteUserModal,
  initDeleteUserModal,
  openEditUserModal,
  initEditUserModal,
};
