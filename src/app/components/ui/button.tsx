import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-[#cf2e2e] text-white hover:shadow-lg hover:shadow-[#cf2e2e]/30 font-semibold",
      outline: "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400",
      ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
      destructive: "bg-[#d99e4c] text-white hover:shadow-lg hover:shadow-[#d99e4c]/30",
      secondary: "bg-[#757575] text-white hover:shadow-lg hover:shadow-[#757575]/30",
    };

    const sizeClasses = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-11 w-11",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-sm",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };