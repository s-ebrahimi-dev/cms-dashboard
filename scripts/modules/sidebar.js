export const initSidebar = () => {
  const sidebar = document.querySelector("#sidebar");
const mobileSidebar = document.querySelector("#mobile-aside");
const overlay = document.querySelector("#overlay");
const asideLgBtn = document.querySelector(".aside-lg-btn");
const asideSmBtn = document.querySelector(".aside-mobile-btn");
const openSvgIcon = document.querySelector(".open-icon");
const closeSvgIcon = document.querySelector(".close-icon");
const mobileCloseSvgIcon = document.querySelector(".mobile-close-icon");
const mobileOpenSvgIcon = document.querySelector(".mobile-open-icon");

overlay.addEventListener("click", () => {
  sidebar.classList.remove("aside--open");
  mobileSidebar.classList.remove("aside--open");
  overlay.classList.add("hidden");
  openSvgIcon.classList.remove("hidden");
  closeSvgIcon.classList.add("hidden");
  mobileOpenSvgIcon.classList.remove("hidden");
  mobileCloseSvgIcon.classList.add("hidden");
});

function toggleSidebar(sidebarElement, openIcon, closeIcon) {
  if (!overlay.classList.contains("hidden")) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.remove("hidden");
  }

  sidebarElement.classList.toggle("aside--open");

  openIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
}

asideLgBtn.addEventListener("click", (event) => {
  event.preventDefault();

  toggleSidebar(sidebar, openSvgIcon, closeSvgIcon);
});

asideSmBtn.addEventListener("click", (event) => {
  event.preventDefault();

  toggleSidebar(mobileSidebar, mobileOpenSvgIcon, mobileCloseSvgIcon);
});

}
