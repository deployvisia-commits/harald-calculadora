import React from "react";
import logoImage from "../../assets/logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoImage}
      alt="Harald Logo"
      className={className}
    />
  );
}