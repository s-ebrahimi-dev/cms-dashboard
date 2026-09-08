import { login } from "./funcs/auth.js";
import { loadComponent } from "./components/component-Loader.js";
import { initResultModal, showResultModal } from "./components/result-modal.js";
await loadComponent(
  "result-modal-container",
  "/Components/register-modal.html",
);
initResultModal();
const loginBtn = document.querySelector("#loginButton");

loginBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const result = await login();
  if (result.success) {
    showResultModal(
      "success",
      "You have logged in successfully.",
      "./pages/Admin/Dashboard/dashboard.html",
    );
  } else {
    showResultModal("error", result.message);
  }
});
