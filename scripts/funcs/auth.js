import { showResultModal } from "../components/result-modal.js";
import { base_URL } from "../config.js";
import { hideLoader, showLoader } from "./loader.js";
const register = async () => {
  try {
    const firstNameInput = document.querySelector("#firstname");
    const lastNameInput = document.querySelector("#lastname");
    const userNameInput = document.querySelector("#username");
    const phoneInput = document.querySelector("#phone");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirmPassword");

    const newUser = {
      firstname: firstNameInput.value.trim(),
      lastname: lastNameInput.value.trim(),
      username: userNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      confirmPassword: confirmPasswordInput.value.trim(),
    };
    if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
      return {
        success: false,
        message: "Passwords do not match.",
      };
    }

    const res = await fetch(`${base_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const result = await res.json();

    console.log(result);

    return {
      success: res.ok,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

const login = async () => {
  const identifierInput = document.querySelector("#identifier");
  const passwordInput = document.querySelector("#password");

  const userInfos = {
    identifier: identifierInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  const checkLoggedUser = await fetch(`${base_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userInfos),
  });

  const checkRes = await checkLoggedUser.json();
  if (!checkLoggedUser.ok) {
    return { success: false, message: checkRes.message };
  }

  console.log("LOGIN RESPONSE:", checkRes);
  return { success: true, data: checkRes.data, message: checkRes.message };
};
 
const getMe = async () => {
  const res = await fetch(`${base_URL}/users/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
};

const logout = async () => {
  try {
    const response = await fetch(`${base_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    console.log(data.message);

    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
};


const createUser = async () => {
  try {
    const createRoleElem = document.querySelector("#createRole");
    const firstNameInput = document.querySelector("#firstname");
    const lastNameInput = document.querySelector("#lastname");
    const userNameInput = document.querySelector("#username");
    const phoneInput = document.querySelector("#phone");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirmPassword");
    const capacityInput = document.querySelector("#maxConcurrentVehicles");

    const role = createRoleElem.value;

    if (!role) {
      throw new Error("Role must be selected.");
    }

    const technicianRoles = [
      "MECHANIC",
      "OIL_TECHNICIAN",
      "BODY_REPAIR",
      "DETAILING_TECHNICIAN",
      "WASH_TECHNICIAN",
    ];

    const newUser = {
      firstname: firstNameInput.value.trim(),
      lastname: lastNameInput.value.trim(),
      username: userNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
      confirmPassword: confirmPasswordInput.value.trim(),
      role,
    };

    if (technicianRoles.includes(role)) {
      const capacity = Number(capacityInput.value);

      if (
        capacityInput.value.trim() === "" ||
        !Number.isInteger(capacity) ||
        capacity < 1
      ) {
        throw new Error(
          "Maximum concurrent vehicles must be a positive integer.",
        );
      }

      newUser.maxConcurrentVehicles = capacity;
    }
    showLoader("Creating User", "please wait...")
    const res = await fetch(`${base_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    if (res.ok) {
      showResultModal("success", "User created successfully")
    } else {
       showResultModal("error", data.message)
}

    console.log("USER CREATED:", data);
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
  } finally {
    hideLoader()
  }
};


const requestOtp = async (phone) => {
  const response = await fetch(`${base_URL}/users/otp/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: result.message || "Unable to send OTP.",
    };
  }

  return {
    success: true,
    data: result,
    message: result.message,
  };
};

const retryOtp = async (uuid) => {
  const response = await fetch(`${base_URL}/users/otp/retry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ uuid }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: result.message || "Unable to resend OTP.",
    };
  }

  return {
    success: true,
    data: result,
    message: result.message,
  };
};

const verifyOtp = async (uuid, code) => {
  const response = await fetch(`${base_URL}/users/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ uuid, code }),
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: result.message || "OTP verification failed.",
    };
  }

  return {
    success: true,
    data: result.data,
    message: result.message,
  };
};


export { register, login, getMe, logout, createUser,requestOtp, retryOtp, verifyOtp };
