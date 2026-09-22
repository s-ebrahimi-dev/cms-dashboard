const currentTheme = localStorage.getItem("theme");

document.documentElement.classList.toggle(
  "dark",
  currentTheme === "dark"
);