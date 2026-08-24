const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");
const asideLgBtn = document.querySelector(".aside-lg-btn")
const menuList = document.querySelector(".menu-list")
const openSvgIcon = document.querySelector(".open-icon")
const closeSvgIcon = document.querySelector(".close-icon")


overlay.addEventListener("click", () => {
  sidebar.classList.remove("aside--open");
  overlay.classList.add("hidden");
   openSvgIcon.classList.remove("hidden")
  closeSvgIcon.classList.add("hidden")
});

asideLgBtn.addEventListener("click", (event) => {
    event.preventDefault()
  if (!overlay.classList.contains("hidden")) {
    overlay.classList.add("hidden")
  } else {
    overlay.classList.remove("hidden")
  }
  console.log("clicked");
  
  sidebar.classList.toggle("aside--open")
  openSvgIcon.classList.add("hidden")
  closeSvgIcon.classList.remove("hidden")

  if (!sidebar.classList.contains("aside--open")) {
    openSvgIcon.classList.remove("hidden")
  closeSvgIcon.classList.add("hidden")
  }


})
