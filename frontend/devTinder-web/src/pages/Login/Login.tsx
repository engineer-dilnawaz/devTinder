import { Link } from "react-router";

import { Loading } from "../../components/Loading";
import { useLogin } from "./useLogin";

const Login = () => {
  const { register, formState, mutationError, loading, handleSubmit } =
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
                {...register("email")}
                className={`input transition-colors outline-none ${
                  formState.errors.email ? "border-error" : ""
                }`}
                placeholder="Email"
              />
              {formState.errors.email && (
                <p className="text-error">{formState.errors.email.message}</p>
              )}
              <label className="label">Password</label>
              <input
                {...register("password")}
                type="password"
                className={`input transition-colors outline-none ${
                  formState.errors.password ? "border-error" : ""
                }`}
                placeholder="Password"
              />
              {formState.errors.password && (
                <p className="text-error">
                  {formState.errors.password.message}
                </p>
              )}
              <div className="flex justify-end mr-4">
                <Link to="/forgot-password" className="link link-hover ">
                  Forgot password?
                </Link>
              </div>

              <button
                className={"btn btn-neutral transition-colors mt-4"}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loading size="sm" color="primary" /> : "Login"}
              </button>
              {mutationError && (
                <div className="text-red-500 h-4">{mutationError?.message}</div>
              )}

              <div className="mt-2">
                Don&apos;t have an account?
                <Link to="/signup" className="link link-hover ml-0.5">
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
