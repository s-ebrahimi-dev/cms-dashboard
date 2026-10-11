import { loadComponent } from "../../components/component-Loader.js";
import { openCreateAppointmentModal } from "../../funcs/shared.js";
await loadComponent(
    "appointment-modal",
    "/Components/receptionist/create-appointment-modal.html"
)
const newAppointmentButton = document.querySelector("#new-appointment-button")
const quickNewAppointmentButton = document.querySelector("#quick-new-appointment")


newAppointmentButton.addEventListener("click", openCreateAppointmentModal)
quickNewAppointmentButton.addEventListener("click", openCreateAppointmentModal)