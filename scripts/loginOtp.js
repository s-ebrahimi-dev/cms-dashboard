
import {
  requestOtp,
  retryOtp,
  verifyOtp,
} from "./funcs/auth.js";

import { loadComponent } from "./components/component-Loader.js";

import {
  initResultModal,
  showResultModal,
} from "./components/result-modal.js";

import {
  showLoader,
  hideLoader,
} from "./funcs/loader.js";

const dashboardRoutes = {
  ADMIN: "/pages/Admin/Dashboard/dashboard.html",
  CUSTOMER: "/pages/Customer/dashboard.html",
  RECEPTIONIST: "/pages/Receptionist/dashboard.html",
  MECHANIC: "/pages/Mechanic/dashboard.html",
  OIL_TECHNICIAN: "/pages/Oil-Technician/dashboard.html",
  BODY_REPAIR: "/pages/Body-Repair/dashboard.html",
  DETAILING_TECHNICIAN: "/pages/Detailing-Technician/dashboard.html",
  WASH_TECHNICIAN: "/pages/Wash-Technician/dashboard.html",
};

await loadComponent(
  "result-modal-container",
  "/Components/result-modal.html",
);

await loadComponent(
  "loader-container",
  "/Components/loader.html",
);

initResultModal();

const loginForm = document.querySelector("#login-form");
const phoneInput = document.querySelector("#phone");
const otpInput = document.querySelector("#otp-code");

const phoneStep = document.querySelector("#phone-step");
const otpStep = document.querySelector("#otp-step");

const sendOtpButton = document.querySelector("#send-otp-button");
const verifyOtpButton = document.querySelector("#verify-otp-button");
const resendOtpButton = document.querySelector("#resend-otp-button");
const changePhoneButton = document.querySelector("#change-phone-button");

let otpUuid = null;
let isRequestingOtp = false;
let isVerifyingOtp = false;
let isResendingOtp = false;

const setBusy = (button, busy, busyText, normalText) => {
  button.disabled = busy;
  button.textContent = busy ? busyText : normalText;
};

const showError = (message) => {
  showResultModal("error", message);
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isRequestingOtp) return;

  if (!phoneInput.reportValidity()) return;

  isRequestingOtp = true;
  setBusy(
    sendOtpButton,
    true,
    "Sending code...",
    "Send verification code",
  );

  showLoader("loading", "Sending verification code...");

  try {
    const result = await requestOtp(phoneInput.value.trim());

    if (!result.success) {
      showError(result.message);
      return;
    }

    otpUuid = result.data.uuid;

    if (!otpUuid) {
      showError("The server did not return an OTP session. Please try again.");
      return;
    }

    phoneStep.classList.add("hidden");
    otpStep.classList.remove("hidden");

    otpInput.required = true;
    otpInput.value = "";
    otpInput.focus();
  } catch (error) {
    console.error("REQUEST OTP ERROR:", error);
    showError("Unable to send the verification code. Please try again.");
  } finally {
    hideLoader();
    isRequestingOtp = false;

    setBusy(
      sendOtpButton,
      false,
      "Sending code...",
      "Send verification code",
    );
  }
});

verifyOtpButton.addEventListener("click", async () => {
  if (isVerifyingOtp) return;

  if (!otpUuid) {
    showError("Your OTP session is missing. Please request a new code.");
    return;
  }

  const code = otpInput.value.trim();

  if (!/^[0-9۰-۹٠-٩]{4,6}$/.test(code)) {
    showError("Enter a valid verification code.");
    otpInput.focus();
    return;
  }

  isVerifyingOtp = true;

  setBusy(
    verifyOtpButton,
    true,
    "Verifying...",
    "Verify and sign in",
  );

  showLoader("loading", "Verifying verification code...");

  try {
    const result = await verifyOtp(otpUuid, code);

    if (!result.success) {
      showError(result.message);
      return;
    }

    const user = result.data;
    const dashboardRoute = dashboardRoutes[user?.role];

    if (!dashboardRoute) {
      showError("Your account does not have a valid dashboard.");
      return;
    }

    otpUuid = null;

    showResultModal(
      "success",
      "You have logged in successfully.",
      dashboardRoute,
    );
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    showError("Unable to verify the code. Please try again.");
  } finally {
    hideLoader();
    isVerifyingOtp = false;

    setBusy(
      verifyOtpButton,
      false,
      "Verifying...",
      "Verify and sign in",
    );
  }
});

resendOtpButton.addEventListener("click", async () => {
  if (isResendingOtp || !otpUuid) return;

  isResendingOtp = true;

  setBusy(
    resendOtpButton,
    true,
    "Resending...",
    "Resend code",
  );

  showLoader("loading", "Resending verification code...");

  try {
    const result = await retryOtp(otpUuid);

    if (!result.success) {
      showError(result.message);
      return;
    }

    otpUuid = result.data.uuid;
    otpInput.value = "";

    showResultModal("success", "A new verification code has been sent.");
    otpInput.focus();
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    showError("Unable to resend the code. Please try again.");
  } finally {
    hideLoader();
    isResendingOtp = false;

    setBusy(
      resendOtpButton,
      false,
      "Resending...",
      "Resend code",
    );
  }
});

changePhoneButton.addEventListener("click", () => {
  otpUuid = null;
  otpInput.value = "";
  otpInput.required = false;

  otpStep.classList.add("hidden");
  phoneStep.classList.remove("hidden");

  phoneInput.focus();
});
