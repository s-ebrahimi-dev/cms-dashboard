import { login } from "./funcs/auth.js";

import { loadComponent } from "./components/component-Loader.js";

import {
  initResultModal,
  showResultModal,
} from "./components/result-modal.js";

import {
  showLoader,
  hideLoader,
} from "./funcs/loader.js";


const dashboardRoutes = {
  ADMIN: "/pages/Admin/Dashboard/dashboard.html",
  CUSTOMER: "/pages/Customer/dashboard.html",
  RECEPTIONIST: "/pages/Receptionist/dashboard.html",
  MECHANIC: "/pages/Mechanic/dashboard.html",
  OIL_TECHNICIAN: "/pages/Oil-Technician/dashboard.html",
  BODY_REPAIR: "/pages/Body-Repair/dashboard.html",
  DETAILING_TECHNICIAN: "/pages/Detailing-Technician/dashboard.html",
  WASH_TECHNICIAN: "/pages/Wash-Technician/dashboard.html",
};


await loadComponent(
  "result-modal-container",
  "/Components/result-modal.html",
);

await loadComponent(
  "loader-container",
  "/Components/loader.html"
);

initResultModal();


const loginBtn = document.querySelector("#loginButton");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  showLoader();

  try {
    const result = await login();

    hideLoader();

    if (result.success) {
      const dashboardRoute = dashboardRoutes[result.data.role];

      if (!dashboardRoute) {
        showResultModal(
          "error",
          "Your account does not have a valid dashboard."
        );
        return;
      }

      showResultModal(
        "success",
        "You have logged in successfully.",
        dashboardRoute
      );

    } else {
      showResultModal(
        "error",
        result.message
      );
    }

  } catch (error) {
    hideLoader();

    showResultModal(
      "error",
      "Something went wrong. Please try again."
    );

    console.error(error);
  }
});