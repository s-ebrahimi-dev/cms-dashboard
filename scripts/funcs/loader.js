export const showLoader =(message, submessage )=> {
  const loader = document.getElementById("loading-overlay");

  if (!loader) return;

  const loadingMessage = document.getElementById("loading-message");
  const loadingSubmessage = document.getElementById("loading-submessage");

  if (loadingMessage) {
    loadingMessage.textContent = message;
  }

  if (loadingSubmessage) {
    loadingSubmessage.textContent = submessage;
  }

  loader.classList.remove("hidden");
  loader.classList.add("flex");
}

export const  hideLoader = () =>{
  const loader = document.getElementById("loading-overlay");

  if (!loader) return;

  loader.classList.add("hidden");
  loader.classList.remove("flex");
}


