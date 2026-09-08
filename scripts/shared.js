import { loadComponent } from "./components/component-Loader.js";
import { initSidebar } from "./modules/sidebar.js";
import { base_URL } from "./config.js";
import { logout } from "./funcs/auth.js";
const initSide = async () => {
    await loadComponent("sidebar-container", "/Components/sidebar.html");

};
    console.log(
  document.querySelector("#sidebar-container").innerHTML
);
initSidebar()


const userImage = document.querySelector(".user-image");
if (userImage) {
  userImage.src = `${base_URL}/users/profile-image`;
}

const logoutLink = document.getElementById("logout");
if (logoutLink) {
    logoutLink.addEventListener("click", async (event) => { 
        console.log("clicked");
        event.preventDefault();
        await logout();
    });
}

initSide();