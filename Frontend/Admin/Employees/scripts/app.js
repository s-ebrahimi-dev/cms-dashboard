const menusmBtn = document.querySelector("#menu-btn");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");
const asideLgBtn = document.querySelector(".aside-lg-btn")

menusmBtn.addEventListener("click", (event) => {
    console.log(event.target);
    
    console.log("clicked");
    
  sidebar.classList.toggle("-translate-x-full");

  overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");

  overlay.classList.add("hidden");
});

asideLgBtn.addEventListener("click", (event) => {
  event.preventDefault()
  console.log("clicked");
  
  sidebar.classList.toggle("aside--open")
  asideLgBtn.classList.toggle("hidden")

})