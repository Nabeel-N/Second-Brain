interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  text: string;
  startIcon?: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
}

const variantClasses = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const defaultStyles = "px-4 py-2 rounded-md font-light flex items-center";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${variantClasses[variant]} ${defaultStyles} ${
        fullWidth ? "w-full flex justify-center items-center" : ""
      } ${loading ? "opacity-45" : ""} ${className || ""}`}
      disabled={loading}
    >
      <div className="pr-2">{startIcon}</div>
      {text}
    </button>
  );
}

export default Button;
