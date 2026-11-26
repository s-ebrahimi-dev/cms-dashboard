import { useState } from "react";
import { login } from "../../../scripts/funcs/auth.js";
import ResultModal from "../../../public/Components/ResultModal.jsx";
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
function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await login({
        identifier: identifier.trim(),
        password,
      });
      const dashboardRoute = dashboardRoutes[result.data.role];
      if (!dashboardRoute) {
        <ResultModal
          type={"error"}
          icon={"/images/Gifs/error.gif"}
          title={"Something went wrong"}
          message={"Your account does not have a valid dashboard."}
        />;
        return;
      }

      if (!result.success) {
        <ResultModal
          type={"error"}
          icon={"/images/Gifs/error.gif"}
          title={"Something went wrong"}
          message={result.message}
        />;
        return;
      }
      <ResultModal
        type={"success"}
        icon={"/images/Gifs/success.gif"}
        title={"Success"}
        message={"You have logged in successfully."}
      />;
      console.log("Logged in:", result.data);

      // Navigation will be handled here.
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/cover.png")' }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* CENTER */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {/* LOGIN CARD */}
        <div className="login-card h-155 w-120 max-w-full rounded-2xl px-10 py-4 bg-white/45 shadow-2xl overflow-y-auto">
          {/* HEADER */}
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-16 items-center justify-center">
              <img src="/images/icon-2.png" alt="logo-png" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>

            <p className="mt-2 text-sm text-zinc-950">
              Sign in to your AutoCare account
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="identifier"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="john@example.com"
                className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <a
                  href="#"
                  className="text-xs font-medium text-indigo-800 transition hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* REMEMBER */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />

              <label htmlFor="remember" className="text-sm text-slate-700">
                Remember me
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.99]"
            >
              Sign in
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {/* REGISTER */}
          <div className="text-center">
            <p className="text-sm text-zinc-950">
              Don't have an account?
              <a
                href="/register.html"
                className="ml-1 font-semibold text-indigo-800 transition hover:text-blue-500"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
