
const root = document.documentElement;

export const getCurrentTheme = () =>
  localStorage.getItem("theme") || "light";

export const applyTheme = (theme) => {
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);

  // Synchronize the header toggle.
  const themeToggle = document.querySelector("#theme-toggle");

  if (themeToggle) {
    const isDark = theme === "dark";

    themeToggle.classList.toggle("is-dark", isDark);

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  }

  // Synchronize the Settings radio buttons.
  document
    .querySelectorAll('input[name="theme"]')
    .forEach((option) => {
      option.checked = option.value === theme;
    });
};

export const initThemeSettings = () => {
  const themeOptions = document.querySelectorAll(
    'input[name="theme"]',
  );

  // Reflect the saved preference without requiring a click.
  themeOptions.forEach((option) => {
    option.checked = option.value === getCurrentTheme();

    option.addEventListener("change", () => {
      if (option.checked) {
        applyTheme(option.value);
      }
    });
  });
};

export const initThemeToggle = () => {
  const themeToggle = document.querySelector("#theme-toggle");

  if (!themeToggle) return;

  // Initialize the button to match the saved theme.
  applyTheme(getCurrentTheme());

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(nextTheme);
  });
};
