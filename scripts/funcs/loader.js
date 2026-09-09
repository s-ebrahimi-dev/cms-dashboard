export function showLoader() {
    const loader = document.getElementById("loading-overlay");

    if (!loader) return;
    
    loader.classList.remove("hidden");
    loader.classList.add("flex");
}


export function hideLoader() {
    const loader = document.getElementById("loading-overlay");

    if (!loader) return;

    loader.classList.add("hidden");
    loader.classList.remove("flex");
}