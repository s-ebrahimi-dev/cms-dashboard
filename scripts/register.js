import { register } from "./funcs/auth.js";
import { loadComponent } from "./components/component-Loader.js";
import {
  initResultModal,
  showResultModal,
} from "./components/result-modal.js";
import { showLoader, hideLoader } from "./funcs/loader.js";

// Load modal HTML
await loadComponent("result-modal-container", "/Components/result-modal.html");
await loadComponent("loader-container", "/Components/loader.html");

// Prepare modal
initResultModal();

const registerBtn = document.querySelector("#registerButton");

registerBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  showLoader("Registering", "Please wait...");

  try {
    const result = await register();

    hideLoader();

    if (result.success) {
      // Preserve the email for the verification page
      sessionStorage.setItem("pendingVerificationEmail", result.email);
      
      showResultModal(
        "success",
        "A verification code has been sent to your email. Please check your inbox to complete your registration.",
      );
    } else {
      showResultModal("error", result.message);
    }
  } catch (error) {
    hideLoader();

    console.error("Registration error:", error);

    showResultModal(
      "error",
      "Something went wrong. Please try again.",
    );
  }
});