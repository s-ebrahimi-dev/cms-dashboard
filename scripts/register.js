import { register } from "./funcs/auth.js";
import { loadComponent } from "./components/component-Loader.js";
import { initResultModal, showResultModal } from "./components/result-modal.js";

// Load modal HTML
await loadComponent(
  "result-modal-container",
  "/Components/register-modal.html",
);

// Prepare modal (but don't show it)
initResultModal();

const registerBtn = document.querySelector("#registerButton");

registerBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const result = await register();

  if (result.success) {
    showResultModal("success", "Your account has been created successfully.", "./pages/Admin/Dashboard/dashboard.html");
  } else {
    showResultModal("error", result.message);
  }
});
