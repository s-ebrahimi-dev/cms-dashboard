import { logout } from "../funcs/auth.js";

export function initLogoutModal() {
    const logoutLinks = document.querySelectorAll("#logout");
    console.log(logoutLinks);
    
    const logoutModal = document.getElementById("logout-modal");
    console.log(logoutModal);
    
    const cancelLogout = document.getElementById("cancel-logout");

    const confirmLogout = document.getElementById("confirm-logout");


    if (!logoutLinks || !logoutModal) return;


    // Open modal
    logoutLinks.forEach((logoutlink) => {
        logoutlink.addEventListener("click", (event) => {
            event.preventDefault();
            
            logoutModal.classList.remove("hidden");
            logoutModal.classList.add("flex");
        })
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