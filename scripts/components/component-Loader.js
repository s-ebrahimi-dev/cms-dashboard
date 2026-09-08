export async function loadComponent(id, path) {

    const container = document.getElementById(id);

    const res = await fetch(path);

    const html = await res.text();

    container.innerHTML = html;
}