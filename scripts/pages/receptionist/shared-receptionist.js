import { getAppointment } from "../../funcs/shared.js";
const appointments = await getAppointment()
console.log(appointments);
