export const showLoader = (
  message = "Loading...",
  submessage = "Please wait...",
  containerId = "loader-container"
) => {
  const container = document.getElementById(containerId);

  if (!container) return;

  const loader = container.querySelector(".loading-overlay");

  if (!loader) return;

  const loadingMessage = loader.querySelector(".loading-message");
  const loadingSubmessage = loader.querySelector(".loading-submessage");

  if (loadingMessage) {
    loadingMessage.textContent = message;
  }

  if (loadingSubmessage) {
    loadingSubmessage.textContent = submessage;
  }

  loader.classList.remove("hidden");
  loader.classList.add("flex");
};

export const hideLoader = (containerId = "loader-container") => {
  const container = document.getElementById(containerId);

  if (!container) return;

  const loader = container.querySelector(".loading-overlay");

  if (!loader) return;

  loader.classList.add("hidden");
  loader.classList.remove("flex");
};