import { Link } from "react-router";

export const Logo = () => {
  return (
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl">
        🚀 DevTinder
      </Link>
    </div>
  );
};
