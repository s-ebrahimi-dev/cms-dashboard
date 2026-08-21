const menuBtn = document.querySelector("#menu-btn");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");


menuBtn.addEventListener("click", (event) => {
    console.log(event.target);
    
    console.log("clicked");
    
  sidebar.classList.toggle("-translate-x-full");

  overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");

  overlay.classList.add("hidden");
});
