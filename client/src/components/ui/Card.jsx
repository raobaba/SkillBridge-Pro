import * as React from "react";

// ✅ Helper function (class name merge)
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-white shadow-md dark:bg-gray-900 dark:border-gray-700",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-4 border-b", className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-4", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-4 border-t", className)} {...props} />
);

// Input Component
const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-gray-700 bg-black/30 backdrop-blur-sm px-4 py-2 text-sm text-gray-100",
          "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          "transition duration-300 ease-in-out",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Button Component
const Button = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl px-5 py-2 font-medium transition-all duration-300";

    const variants = {
      default:
        "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:scale-105 shadow-lg",
      outline:
        "border border-indigo-400 text-indigo-300 hover:bg-indigo-600/20",
      ghost: "text-gray-300 hover:text-white hover:bg-white/10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const StackOverflowIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M17.47 20.5v-5h2v7h-14v-7h2v5h10zm-9.94-1h9.88v-2h-9.88v2zm.24-4.41 9.67 2.03.42-1.96-9.67-2.03-.42 1.96zm1.26-4.76 9.04 4.14.84-1.82-9.04-4.14-.84 1.82zm2.48-4.54 7.65 6.53 1.3-1.53-7.65-6.53-1.3 1.53zm5.04-4.29-1.56 1.27 5.9 7.24 1.56-1.27-5.9-7.24z" />
  </svg>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Input,StackOverflowIcon };
