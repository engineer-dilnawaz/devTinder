import Lottie from "lottie-react";
import { Link, useRouteError } from "react-router";

import lottieData from "../assets/lottie/404.json";

export const ErrorPage = () => {
  const error = useRouteError() as unknown as {
    statusText: string;
    data: string;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card bg-base-200 w-96 shadow-sm">
        <figure>
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            className="w-auto h-2/3"
          />
        </figure>
        <div className="card-body gap-1">
          <h2 className="card-title">{error?.statusText || "404"}</h2>
          <p className="text-sm text-gray-500">
            {error?.data || "This page is not available"}
          </p>
          <div className="card-actions justify-end">
            <Link to="/" className="btn btn-soft rounded-2xl">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
