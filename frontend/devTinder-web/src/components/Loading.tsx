type LoadingProps = {
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
};

export const Loading = ({ size = "xs", color = "primary" }: LoadingProps) => {
  return (
    <span
      className={`loading loading-infinity loading-${size} text-${color}`}
    ></span>
  );
};
