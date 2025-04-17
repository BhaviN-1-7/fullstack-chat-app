// components/Spinner.jsx
import React from "react";

export const Spinner = ({ size = "md", color = "text-white" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={`border-2 border-t-${color} border-${color} rounded-full ${sizeClasses[size]} animate-spin`}
      style={{ borderTopColor: color }}
    />
  );
};