import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Card({
  children,
  className = "",
  padding = "md",
  shadow = "md",
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-lg",
    lg: "shadow-xl",
    xl: "shadow-2xl",
  };

  const classes = `bg-white rounded-2xl border border-gray-100 ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`;

  return <div className={classes}>{children}</div>;
}
