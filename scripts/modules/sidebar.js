const roleMenus = {
  ADMIN: {
    dashboard: "/pages/Admin/Dashboard/dashboard.html",
    customers: "/pages/Admin/Customers/customer.html",
    vehicles: "/pages/Admin/Vehicles/vehicles.html",
    appointments: "/pages/Admin/Appointment/appointment.html",
    services: "/pages/Admin/Services-page/services.html",
    employees: "/pages/Admin/Employees/employees.html",
    invoices: "/pages/Admin/Invoices/invoices.html",
    payments: "/pages/Admin/Payment/payment.html",
    users: "/pages/Admin/Users/users.html",
    settings: "/pages/Admin/Settings-page/settings.html",
  },

  CUSTOMER: {
    dashboard: "/pages/Customer/dashboard.html",
    vehicles: "/pages/Customer/vehicles.html",
    appointments: "/pages/Customer/appointment.html",
    payments: "/pages/Customer/payment.html",
    settings: "/pages/Customer/settings.html",
  },

  RECEPTIONIST: {
    dashboard: "/pages/Receptionist//dashboard.html",
    customers: "/pages/Receptionist//customer.html",
    vehicles: "/pages/Receptionist//vehicles.html",
    appointments: "/pages/Receptionist//appointment.html",
    services: "/pages/Receptionist/services.html",
    payments: "/pages/Receptionist//payment.html",
    settings: "/pages/Receptionist/settings.html",
  },

  MECHANIC: {
    dashboard: "/pages/Mechanic/dashboard.html",
    vehicles: "/pages/Mechanic/vehicles.html",
    appointments: "/pages/Mechanic/appointment.html",
    services: "/pages/Mechanic/services.html",
    settings: "/pages/Mechanic/settings.html",
  },

  OIL_TECHNICIAN: {
    dashboard: "/pages/Oil-Technician/dashboard.html",
    appointments: "/pages/Oil-Technician/appointment.html",
    services: "/pages/Oil-Technician/services.html",
    settings: "/pages/Oil-Technician/settings.html",
  },

  BODY_REPAIR: {
    dashboard: "/pages/Body-Repair/dashboard.html",
    appointments: "/pages/Body-Repair/appointment.html",
    services: "/pages/Body-Repair/services.html",
    settings: "/pages/Body-Repair/settings.html",
  },

  DETAILING_TECHNICIAN: {
    dashboard: "/pages/Detailing-Technician/dashboard.html",
    appointments: "/pages/Detailing-Technician/appointment.html",
    services: "/pages/Detailing-Technician/services.html",
    settings: "/pages/Detailing-Technician/settings.html",
  },

  WASH_TECHNICIAN: {
    dashboard: "/pages/Wash-Technician/dashboard.html",
    appointments: "/pages/Wash-Technician/appointment.html",
    services: "/pages/Wash-Technician/services.html",
    settings: "/pages/Wash-Technician/settings.html",
  },
};
export const initSidebar = (user) => {
  const sidebar = document.querySelector("#sidebar");
const mobileSidebar = document.querySelector("#mobile-aside");
const overlay = document.querySelector("#overlay");
const asideLgBtn = document.querySelector(".aside-lg-btn");
const asideSmBtn = document.querySelector(".aside-mobile-btn");
const openSvgIcon = document.querySelector(".open-icon");
const closeSvgIcon = document.querySelector(".close-icon");
const mobileCloseSvgIcon = document.querySelector(".mobile-close-icon");
const mobileOpenSvgIcon = document.querySelector(".mobile-open-icon");

 const userMenus = roleMenus[user.role] ?? {};

const roleMenuItems = document.querySelectorAll(
  ".menu-list .list-item[data-menu]"
);

roleMenuItems.forEach((menuItem) => {
  const menuName = menuItem.dataset.menu;

  if (!userMenus[menuName]) {
    menuItem.remove();
    return;
  }

  const link = menuItem.querySelector(".menu-item");

  if (link) {
    link.href = userMenus[menuName];
  }
});
  
overlay.addEventListener("click", () => {
  sidebar.classList.remove("aside--open");
  mobileSidebar.classList.remove("aside--open");
  overlay.classList.add("hidden");
  openSvgIcon.classList.remove("hidden");
  closeSvgIcon.classList.add("hidden");
  mobileOpenSvgIcon.classList.remove("hidden");
  mobileCloseSvgIcon.classList.add("hidden");
});

function toggleSidebar(sidebarElement, openIcon, closeIcon) {
  if (!overlay.classList.contains("hidden")) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.remove("hidden");
  }

  sidebarElement.classList.toggle("aside--open");

  openIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
}

asideLgBtn.addEventListener("click", (event) => {
  event.preventDefault();

  toggleSidebar(sidebar, openSvgIcon, closeSvgIcon);
});

asideSmBtn.addEventListener("click", (event) => {
  event.preventDefault();

  toggleSidebar(mobileSidebar, mobileOpenSvgIcon, mobileCloseSvgIcon);
});

const menuItems = document.querySelectorAll(".menu-item");
const currentPage = window.location.pathname;

menuItems.forEach((menuItem) => {
  if (
    !menuItem.classList.contains("logout-item") &&
    menuItem.pathname === currentPage
  ) {
   menuItem.closest(".list-item").classList.add("active");
  }
});

}
