import { Link } from "react-router";

import { useLogin } from "./useLogin";

const Login = () => {
  const { email, password, error, setEmail, setPassword, handleSubmit } =
    useLogin();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            DevTinder is a platform for developers to find jobs and projects.
          </p>
        </div>
        <div className="card bg-base-300 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className={`input transition-colors outline-none ${
                  error.emailError ? "border-error" : ""
                }`}
                placeholder="Email"
                value={email}
                onChange={setEmail}
              />
              <label className="label mt-4">Password</label>
              <input
                type="password"
                className={`input transition-colors outline-none ${
                  error.passwordError ? "border-error" : ""
                }`}
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />
              <div className="flex justify-end mr-4">
                <Link to="/forgot-password" className="link link-hover ">
                  Forgot password?
                </Link>
              </div>
              {/* <div className="text-red-500 h-4">{error}</div> */}
              <button
                className={"btn btn-neutral transition-colors mt-4"}
                onClick={handleSubmit}
              >
                Login
              </button>

              <div className="mt-2">
                <Link to="/signup" className="link link-hover">
                  Don&apos;t have an account?{" "}
                  <span className="text-base-content">Register here</span>
                </Link>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
