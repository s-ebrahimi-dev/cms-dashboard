let modal;
let icon;
let title;
let message;
let closeBtn;
let redirectUrl = null;
export function initResultModal() {
  modal = document.querySelector("#result-modal");
  icon = document.querySelector("#modal-icon");
  title = document.querySelector("#modal-title");
  message = document.querySelector("#modal-message");
  closeBtn = document.querySelector("#modal-close");

  closeBtn.addEventListener("click", closeModal);
}

export function showResultModal(type, msg, redirect = null) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  message.textContent = msg;

  redirectUrl = redirect;

  if (type === "success") {
    title.textContent = "Account created!";
    title.style.color = "green"
    icon.innerHTML = `
  <img 
    src="/images/Gifs/success.gif" 
    alt="success"
    class="w-10 h-15 mx-auto"
  >
`;
  }

  if (type === "error") {
    title.textContent = "Registration failed";
    title.style.color = "yellow"
    icon.innerHTML = `  <img 
    src="/images/Gifs/error.gif" 
    alt="error"
    class="w-10 h-15 mx-auto"
  >`;
  }
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");

  if (redirectUrl) {
    window.location.href = redirectUrl;
    redirectUrl = null;
  }
}
