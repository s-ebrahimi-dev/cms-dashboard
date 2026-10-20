# AutoCare CMS Dashboard 🚗

<h1 align="center">
  AutoCare CMS Dashboard
  <img src="./icons8-cms-50.png" alt="CMS Logo" width="30" />
</h1>

<p align="center">
  <img src="./public/images/icon-2.png" alt="AutoCare Logo" width="150" />
</p>

<p align="center">
  A responsive car service management dashboard built with HTML, Tailwind CSS, and JavaScript, powered by a Node.js and Express backend.
</p>

AutoCare CMS is a web-based management system designed for automotive service businesses. It provides a centralized dashboard for managing customers, vehicles, appointments, services, employees, invoices, payments, and other daily operations.

The project focuses on modular JavaScript, reusable interface components, API integration, role-based access, and responsive user interfaces.

---

## 🚀 Live Demo

[**View AutoCare CMS**](https://cms-frontend-yhr-cms-frontend.runflare.cloud/)

![Project Status](https://img.shields.io/badge/status-work--in--progress-yellow)

> The project is actively under development, and some features may still be incomplete.

---

## 🛠️ Tech Stack

### Frontend

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

### Backend

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

### Development Tools

<p align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</p>

---

## 🏢 Dashboard Modules

AutoCare CMS is organized around the main workflows of an automotive service business.

| Module | Purpose |
|---|---|
| 📊 Dashboard | Central overview of the management system |
| 👥 Customers | Customer information and management |
| 🚗 Vehicles | Vehicle records associated with customers |
| 📅 Appointments | Appointment creation, scheduling, and availability |
| 🔧 Services | Management of automotive services |
| 👨‍🔧 Employees | Employee information and technician assignments |
| 🧾 Invoices | Invoice management interface |
| 💳 Payments | Payment management interface |
| 👤 Users | User administration |
| 💬 Messages | Conversation and messaging functionality |
| ⚙️ Settings | Application settings and theme preferences |

The system also includes role-oriented workspaces for receptionists, mechanics, and specialized service staff, including car wash, body repair, detailing, and oil-related services.

---

## ✨ Features

### 1. Responsive Dashboard UI

- Responsive layouts for desktop and mobile screens.
- Sidebar navigation with collapsible and mobile navigation behavior.
- Reusable interface components and shared layout elements.
- Light and dark themes.
- Custom theme toggle with animated moon and sun icons.
- Styled tables, forms, modals, dropdowns, and notifications.
- Tailwind CSS-based design system.

### 2. Modular JavaScript Architecture

- JavaScript modules organized by pages, features, shared components, and utilities.
- Reusable functions for common UI behavior.
- Dynamic loading of shared components.
- Separation of interface logic, API requests, and feature-specific responsibilities.
- Event-driven interactions and form handling.

### 3. Authentication and Role-Based Access

- Authentication UI and login workflow.
- JWT-based authentication through the backend.
- HTTP-only authentication cookie.
- Role-based authorization for supported backend routes.
- Support for administrator, customer, receptionist, mechanic, and specialized service-staff roles.
- User profile information and conditional profile-image loading.

### 4. Customer and Vehicle Management

- Customer search and selection.
- Customer information management.
- Vehicle records stored separately and associated with their customers.
- Existing vehicle selection during appointment creation.
- Vehicle information linked to customer records through the backend API.

### 5. Appointment Management

- Appointment creation integrated with the backend.
- Customer and vehicle selection.
- Service selection using backend data.
- Appointment date and available time-slot selection.
- Availability checks based on scheduling rules and service requirements.
- Appointment details associated with customers, vehicles, services, receptionists, and assigned technicians.
- Appointment statuses including `PENDING`, `CONFIRMED`, and `IN_PROGRESS`.
- Backend scheduling logic that accounts for technician roles and concurrent booking capacity.

### 6. Services and Employee Assignment

- Service data retrieved from the backend.
- Service-specific technician role requirements.
- Technician assignment associated with appointment records.
- Scheduling support based on service requirements and technician availability.

### 7. Notifications and Messaging

- Notification retrieval and read-status updates through the API.
- Unread notification indicators.
- Conversation creation and message sending.
- Shared conversation-related frontend functionality.

### 8. Backend API Integration

- Communication with a separate REST API.
- Asynchronous data fetching and form submission.
- Request and response handling.
- Error handling for failed requests.
- Integration with MongoDB-backed application data.

---

## 🏗️ Architecture Overview

AutoCare CMS separates the frontend interface from backend business logic.

```text
AutoCare CMS
│
├── Frontend
│   ├── HTML pages
│   ├── Tailwind CSS
│   ├── JavaScript modules
│   ├── Shared components
│   └── API communication
│
└── Backend
    ├── Node.js
    ├── Express.js
    ├── Authentication and authorization
    ├── API routes and controllers
    ├── Business logic
    └── MongoDB / Mongoose
```

The frontend is responsible for rendering the dashboard, handling user interactions, validating input, and communicating with the API. The backend handles authentication, authorization, data persistence, and business rules.

---

## 📂 Project Structure

The following is a high-level overview of the frontend organization. Individual modules and filenames may evolve during development.

```text
Frontend/
│
├── pages/
│   ├── Admin/
│   │   ├── Dashboard/
│   │   ├── Appointment/
│   │   ├── Customers/
│   │   ├── Employees/
│   │   ├── Invoices/
│   │   ├── Payment/
│   │   ├── Services-page/
│   │   ├── Settings-page/
│   │   ├── Users/
│   │   └── Vehicles/
│   │
│   └── Components/
│
├── public/
│   ├── Components/
│   ├── fonts/
│   └── images/
│
├── scripts/
│   ├── components/
│   ├── funcs/
│   ├── models/
│   ├── pages/
│   ├── config.js
│   ├── index.js
│   └── register.js
│
├── shared/
├── src/
│   └── input.css
├── styles/
│   └── app.css
├── index.html
├── package.json
└── vite.config.js

Backend/
├── server.js
├── routes/
├── controllers/
├── models/
├── middleware/
└── ...
```

---

## 📌 Project Status

### ✅ Implemented

- Core dashboard layout and navigation.
- Responsive sidebar and mobile navigation.
- Light and dark theme switching.
- Modular JavaScript structure.
- Shared UI components and dynamic component loading.
- Authentication and authorization integration.
- Customer and vehicle API integration.
- Service data retrieval.
- Appointment creation and availability checking.
- Technician-role and scheduling-capacity logic in the backend.
- Notification API integration.
- Conversation creation and message-sending functionality.
- Frontend deployment.

### 🚧 In Progress

- Further development and refinement of dashboard modules.
- Additional data-table functionality and filtering.
- Completing and polishing customer-facing workflows.
- Improving consistency and usability across roles and screen sizes.
- Expanding appointment and vehicle management workflows.

### 🔮 Future Improvements

- Dashboard analytics and interactive charts.
- Monthly revenue, expenses, and profit reporting.
- AI-assisted business insights for administrators.
- More advanced search, filtering, and reporting.
- Additional animations and interaction improvements.
- Further refinement of role-specific permissions.
- Production deployment and operational improvements.

*Implementation status may change as development continues.*

---

## 🖥️ Dashboard Preview

![AutoCare CMS Dashboard](./public/images/screenshots/CMS-Dashboard.png)

---

## ⚙️ Installation

### Prerequisites

- Node.js and npm.
- Git.
- MongoDB, either locally or through a hosted instance, for backend development.

### 1. Clone the repository

```bash
git clone https://github.com/s-ebrahimi-dev/cms-dashboard
cd cms-dashboard
```

Replace the placeholders with your actual repository URL and directory name.

### 2. Install frontend dependencies

```bash
cd Frontend
npm install
```

### 3. Start the frontend development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### 4. Build for production

```bash
npm run build
```

The production build is generated in the `dist/` directory by default.

### 5. Run the backend

Open a separate terminal and navigate to the backend directory:

```bash
cd Backend
npm install
```

Configure the required environment variables, including the database connection and authentication settings, according to the backend configuration. Then start the backend using the appropriate script defined in its `package.json`.

> **Note:** The exact environment variables and startup command depend on your backend configuration. Never commit secrets, database credentials, or JWT secrets to the repository.

---

## 🔗 Backend API

The frontend communicates with a separate backend built with Node.js, Express.js, MongoDB, and Mongoose.

The backend is responsible for:

- Authentication and role-based authorization.
- User and customer data.
- Vehicle records and customer relationships.
- Service information.
- Appointment scheduling and availability.
- Technician assignments and capacity constraints.
- Notifications and conversations.
- Persistent application data.

The frontend and backend must be configured to communicate with the correct API origin. Local development and production deployments may use different API URLs.

---

## 👨‍💻 Author

**Saeed Ebrahimi**

Frontend developer focused on JavaScript, web application architecture, and practical full-stack development.

GitHub: [@s-ebrahimi-dev](https://github.com/s-ebrahimi-dev)

---

⭐ If you find this project interesting, feel free to explore the repository and follow its development journey.
