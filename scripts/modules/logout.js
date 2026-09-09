import { logout } from "../funcs/auth.js";

export function initLogoutModal() {
    const logoutLink = document.querySelector("#logout");
    const mobileLogoutLink = document.querySelector("#mobile-logout");
    
    const logoutModal = document.getElementById("logout-modal");

    const cancelLogout = document.getElementById("cancel-logout");

    const confirmLogout = document.getElementById("confirm-logout");


    if (!logoutLink || !logoutModal) return;
    if (!mobileLogoutLink || !logoutModal) return;

    // Open modal
    logoutLink?.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Logout clicked");
            logoutModal.classList.remove("hidden");
            logoutModal.classList.add("flex");
        })
    
    mobileLogoutLink?.addEventListener("click", (event) => { 
        event.preventDefault();
        console.log("Mobile logout clicked");
        logoutModal.classList.remove("hidden");
        logoutModal.classList.add("flex");
    })

    // Cancel logout
    cancelLogout?.addEventListener("click", () => {
        logoutModal.classList.add("hidden");
        logoutModal.classList.remove("flex");
    });


    // Confirm logout
    confirmLogout?.addEventListener("click", async () => {
        await logout();
    });
}