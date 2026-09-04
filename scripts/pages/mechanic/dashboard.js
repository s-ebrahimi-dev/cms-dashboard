import { loadComponent } from "../components/components.js";
import { initSidebar } from "../modules/sidebar.js";

loadComponent(
    "sidebar-container",
    "/pages/Components/sidebar.html"
)
.then(() => {
    initSidebar();
});