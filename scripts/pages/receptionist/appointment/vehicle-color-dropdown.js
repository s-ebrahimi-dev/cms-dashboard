
export function initializeVehicleColorDropdown() {
  const dropdown = document.querySelector("#new-vehicle-color-dropdown");
  const hiddenInput = document.querySelector("#new-vehicle-color");
  const trigger = document.querySelector("#new-vehicle-color-trigger");
  const optionsContainer = document.querySelector("#new-vehicle-color-options");
  const selectedSwatch = document.querySelector("#new-vehicle-color-swatch");
  const selectedLabel = document.querySelector("#new-vehicle-color-label");
  const chevron = document.querySelector("#new-vehicle-color-chevron");

  if (
    !dropdown ||
    !hiddenInput ||
    !trigger ||
    !optionsContainer ||
    !selectedSwatch ||
    !selectedLabel ||
    !chevron
  ) {
    console.error("Vehicle color dropdown elements not found.");
    return;
  }

  const colorGroups = [
    {
      label: "Common Colors",
      colors: [
        ["White", "#FFFFFF"],
        ["Black", "#171717"],
        ["Silver", "#C0C0C0"],
        ["Gray", "#808080"],
        ["Red", "#DC2626"],
        ["Blue", "#2563EB"],
        ["Green", "#15803D"],
        ["Yellow", "#FACC15"],
        ["Orange", "#F97316"],
        ["Brown", "#854D0E"],
        ["Beige", "#D6C3A1"],
        ["Gold", "#D4AF37"],
      ],
    },
    {
      label: "Additional Colors",
      colors: [
        ["Navy Blue", "#172554"],
        ["Light Blue", "#7DD3FC"],
        ["Dark Blue", "#1E3A8A"],
        ["Maroon", "#800000"],
        ["Burgundy", "#800020"],
        ["Purple", "#9333EA"],
        ["Teal", "#0F766E"],
        ["Olive", "#808000"],
        ["Champagne", "#F7E7CE"],
        ["Bronze", "#CD7F32"],
        ["Copper", "#B87333"],
        ["Cream", "#FFFDD0"],
        ["Ivory", "#FFFFF0"],
      ],
    },
    {
      label: "Special Finishes",
      colors: [
        ["Pearl White", "#F8F6F0"],
        ["Metallic Silver", "#AEB4BB"],
        ["Metallic Gray", "#696969"],
        ["Metallic Black", "#292929"],
        ["Metallic Blue", "#244A73"],
        ["Metallic Red", "#9F202F"],
        ["Matte Black", "#252525"],
        ["Matte Gray", "#737373"],
        ["Two-Tone", null],
        ["Other", null],
      ],
    },
  ];

  const closeDropdown = () => {
    optionsContainer.classList.add("hidden");
    trigger.setAttribute("aria-expanded", "false");
    chevron.classList.remove("rotate-180");
  };

  const openDropdown = () => {
    optionsContainer.classList.remove("hidden");
    trigger.setAttribute("aria-expanded", "true");
    chevron.classList.add("rotate-180");
  };

  const selectColor = (name, hex) => {
    hiddenInput.value = name;
    selectedLabel.textContent = name;

    selectedLabel.classList.remove("text-gray-500", "dark:text-zinc-400");
    selectedLabel.classList.add("text-gray-900", "dark:text-white");

    selectedSwatch.style.backgroundColor = hex || "transparent";
    selectedSwatch.classList.toggle("border-dashed", !hex);

    trigger.setAttribute("aria-label", `Selected color: ${name}`);

    optionsContainer.querySelectorAll('[role="option"]').forEach((option) => {
      const isSelected = option.dataset.value === name;

      option.setAttribute("aria-selected", String(isSelected));

      const check = option.querySelector("[data-color-check]");
      check?.classList.toggle("invisible", !isSelected);
    });

    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
    closeDropdown();
  };

  colorGroups.forEach((group) => {
    const heading = document.createElement("p");
    heading.className =
      "px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider " +
      "text-gray-400 dark:text-zinc-500";
    heading.textContent = group.label;
    optionsContainer.append(heading);

    group.colors.forEach(([name, hex]) => {
      const option = document.createElement("button");

      option.type = "button";
      option.setAttribute("role", "option");
      option.dataset.value = name;
      option.setAttribute("aria-selected", "false");
      option.className =
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm " +
        "text-gray-700 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " +
        "dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800";

      const swatch = document.createElement("span");
      swatch.className =
        "h-5 w-5 shrink-0 rounded-md border border-gray-300 dark:border-zinc-600";

      if (hex) {
        swatch.style.backgroundColor = hex;
      } else {
        swatch.classList.add("bg-gray-100", "dark:bg-zinc-700");
        swatch.textContent = name === "Two-Tone" ? "½" : "…";
        swatch.classList.add(
          "flex",
          "items-center",
          "justify-center",
          "text-xs",
        );
      }

      const label = document.createElement("span");
      label.className = "flex-1";
      label.textContent = name;

      const check = document.createElement("span");
      check.dataset.colorCheck = "";
      check.className = "invisible text-indigo-600 dark:text-indigo-400";
      check.setAttribute("aria-hidden", "true");
      check.textContent = "✓";

      option.append(swatch, label, check);
      option.addEventListener("click", () => selectColor(name, hex));

      optionsContainer.append(option);
    });
  });

  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdown();
      trigger.focus();
    }
  });

  const form = document.querySelector("#create-appointment-form");

  form?.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      hiddenInput.value = "";
      selectedLabel.textContent = "Select color";

      selectedLabel.classList.add("text-gray-500", "dark:text-zinc-400");
      selectedLabel.classList.remove("text-gray-900", "dark:text-white");

      selectedSwatch.style.backgroundColor = "#FFFFFF";
      selectedSwatch.classList.remove("border-dashed");
      trigger.setAttribute("aria-label", "Select vehicle color");

      optionsContainer.querySelectorAll('[role="option"]').forEach((option) => {
        option.setAttribute("aria-selected", "false");
        option.querySelector("[data-color-check]")?.classList.add("invisible");
      });

      closeDropdown();
    });
  });
}
