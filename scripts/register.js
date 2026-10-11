import { register } from "./funcs/auth.js";
import { loadComponent } from "./components/component-Loader.js";
import { initResultModal, showResultModal } from "./components/result-modal.js";
import { showLoader, hideLoader } from "./funcs/loader.js";

// Load modal HTML
await loadComponent("result-modal-container", "/Components/result-modal.html");
await loadComponent("loader-container", "/Components/loader.html");

// Prepare modal (but don't show it)
initResultModal();

const registerBtn = document.querySelector("#registerButton");

registerBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  showLoader("Registering", "please wait...");

  try {
    const result = await register();
    hideLoader();
    if (result.success) {
      showResultModal(
        "success",
        "Your account has been created successfully.",
        "/index.html",
      );
    } else {
      showResultModal("error", result.message);
    }
  } catch (error) {
    hideLoader();

    showResultModal("error", "Something went wrong. Please try again.");
  }
});
