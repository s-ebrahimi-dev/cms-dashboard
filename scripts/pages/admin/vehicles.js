import { loadComponent } from "../../components/component-Loader.js";
import { initSidebar } from "../../modules/sidebar.js";

loadComponent(
    "sidebar-container",
    "/Components/sidebar.html"
)
.then(() => {
    initSidebar();
});