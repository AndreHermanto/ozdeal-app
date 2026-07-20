import React from "react";
// @ts-ignore
import ozdealImg from "../assets/images/ozdeal.png";

interface OzDealLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onDarkBg?: boolean;
}

export default function OzDealLogo({ className = "", size = "md", onDarkBg = false }: OzDealLogoProps) {
  // Determine dimensions based on size prop
  const dimensions = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }[size];

  // If on a dark background, invert the image to make it white/light so it is clearly visible
  const colorClass = onDarkBg ? "brightness-0 invert" : "";

  return (
    <img
      src={ozdealImg}
      alt="OzDeal Logo"
      className={`${dimensions} object-contain transition-all duration-300 group-hover:scale-105 ${colorClass} ${className}`}
    />
  );
}
