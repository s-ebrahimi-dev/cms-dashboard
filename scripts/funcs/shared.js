import { base_URL } from "../config.js";

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
  console.log(users);
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
                        <!-- EDIT -->

                        <button type="button" class="editUserBtn rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600" title="Edit user">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.5 16.154 6 17.5l1.346-4.5 9.516-8.513Z"></path>

                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125 16.875 4.5"></path>
                          </svg>
                        </button>

                        <!-- DELETE -->

                        <button type="button" class="deleteUserBtn rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" title="Delete user">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21.75H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-10.208 0c-.34.059-.68.114-1.022.166m1.022-.165a48.11 48.11 0 0 1 3.478-.397m7.73 0V4.58c0-1.18-.91-2.203-2.09-2.25a51.964 51.964 0 0 0-3.32 0C8.91 2.377 8 3.4 8 4.58v.813m7.73 0a48.667 48.667 0 0 0-7.73 0"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
      `,
    );
  });
};

export { getAndShowAllUsers };
