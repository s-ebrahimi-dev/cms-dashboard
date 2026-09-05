export async function loadComponent(id, path) {

    const container = document.getElementById(id);

    const res = await fetch(path);

    console.log("Loading component:", path);
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get("content-type"));

    const html = await res.text();

    console.log(html.slice(0, 100));

    container.innerHTML = html;
}