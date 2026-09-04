import { saveIntoLocalStorage, getToken, } from "./utils.js";
import { base_URL } from "../config.js";
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
        message: "Passwords do not match."
      };
    }

    const res = await fetch(
      `${base_URL}/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }
    );


    const result = await res.json();

    console.log(result);
    
    return {
      success: res.ok,
      message: result.message,
      data: result.data
    };


  } catch(error) {

    return {
      success: false,
      message: "Server connection failed."
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

  const checkLoggedUser = await fetch(`http://localhost:4000/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfos),
  });

  if (checkLoggedUser.ok === false) {
    showSwal(
      "کاربری با این مشخصات یافت نشد",
      "error",
      "تصحیح اطلاعات",
      (result) => {
        if (result) {
          identifierInput.value = "";
          passwordInput.value = "";
        } else {
          location.href = "index.html";
        }
      },
    );
  } else if (checkLoggedUser.ok === true) {
    showSwal(
      "ورود با موفقیت انجام شد",
      "success",
      "ورود به پنل کاربری",
      (result) => {
        if (result) {
          location.href = "index.html";
        } else {
          identifierInput.value = "";
          passwordInput.value = "";
        }
      },
    );
    const checkRes = await checkLoggedUser.json();
    console.log(checkRes.accessToken);

    saveIntoLocalStorage("user", { token: checkRes.accessToken });
  }
};

const getMe = async () => {
  const token = getToken();

  if (!token) {
    return false;
  }
  const res = await fetch(`http://localhost:4000/v1/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};

export { register, login, getMe };
