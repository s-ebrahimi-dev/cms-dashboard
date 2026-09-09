import { base_URL } from "../config.js";
import { getToken } from "../funcs/utils.js";
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
  const token = getToken();

  if (!token) {
    return false;
  }
  const res = await fetch(`http://localhost:4000/api/users/me`, {
    credentials: "include",
  });
  const data = await res.json();
  return data;
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

export { register, login, getMe, logout };
