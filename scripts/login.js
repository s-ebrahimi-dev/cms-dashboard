import { login } from "./funcs/auth.js";
import { loadComponent } from "./components/component-Loader.js";
import { initResultModal, showResultModal } from "./components/result-modal.js";
import {
    showLoader,
    hideLoader
} from "./funcs/loader.js";
await loadComponent(
  "result-modal-container",
  "/Components/register-modal.html",
);
await loadComponent(
    "loader-container",
    "/Components/loader.html"
);
initResultModal();
const loginBtn = document.querySelector("#loginButton");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

    // 1. Show loader immediately
  showLoader();
 
    try {

        // 2. Wait for login request
        const result = await login();

        // 3. Hide loader BEFORE showing result modal
        hideLoader();

        // 4. Show result modal
        if (result.success) {

            showResultModal(
                "success",
                "You have logged in successfully.",
                "./pages/Admin/Dashboard/dashboard.html"
            );

        } else {

            showResultModal(
                "error",
                result.message
            );
        }

    } catch (error) {

        // Make sure loader disappears if something unexpected happens
        hideLoader();

        showResultModal(
            "error",
            "Something went wrong. Please try again."
        );

        console.error(error);
    }
});
